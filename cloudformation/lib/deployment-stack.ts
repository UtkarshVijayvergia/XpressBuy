import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_logs as logs } from 'aws-cdk-lib';
import { aws_servicediscovery as servicediscovery } from 'aws-cdk-lib';
import { aws_ecs as ecs } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { aws_ecr as ecr } from 'aws-cdk-lib';
import { aws_elasticloadbalancingv2 as elbv2 } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import * as path from 'path'; // Import path to find local folders

import * as dotenv from 'dotenv';
dotenv.config();

// Define an interface for the props
interface XpressbuyDeploymentStackProps extends cdk.StackProps {
    userPoolId: string;
    userPoolClientId: string;
}

export class XpressbuyDeploymentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: XpressbuyDeploymentStackProps) {
        super(scope, id, props);

        // Make a cloudwatch log group
        const logGroup = new logs.LogGroup(this, '/xpressbuy/fargate-cluster', {
            logGroupName: '/xpressbuy/fargate-cluster',
            retention: logs.RetentionDays.ONE_DAY,
            // When you delete a log group, the data in the log group is deleted.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });


        // 2. CloudMap Namespace
        const namespace = new servicediscovery.HttpNamespace(this, 'xpressbuy', {
            name: 'xpressbuy',
        });
        namespace.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


        // 3. Get Default VPC
        const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', {
            isDefault: true, // Ensures the default VPC is used
        });


        // 4. Security Group for ALB
        const securityGroup_albSecurityGroup = new ec2.SecurityGroup(this, 'XpressbuyAlbSG', {
            vpc: defaultVpc,
            securityGroupName: 'xpressbuy-alb-sg',
            description: 'Security group for XpressBuy ALB',
        });
        securityGroup_albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic');
        securityGroup_albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');
        // Allow traffic from the ALB to the backend and frontend
        securityGroup_albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5000), 'Allow Backend traffic');
        securityGroup_albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3000), 'Allow Frontend traffic');
        // Apply removal policy
        securityGroup_albSecurityGroup.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


        // 5. Security Group for ECS services
        const securityGroup_XpressBuyServiceSG = new ec2.SecurityGroup(this, 'XpressBuyServiceSG', {
            vpc: defaultVpc,
            securityGroupName: 'xpressbuy-srv-sg',
            description: 'Security group for XpressBuy services on ECS',
        });
        // Add an inbound rule to allow HTTP (port 80) traffic from anywhere
        securityGroup_XpressBuyServiceSG.addIngressRule(securityGroup_albSecurityGroup, ec2.Port.tcp(5000), 'Allow traffic from ALB');
        securityGroup_XpressBuyServiceSG.addIngressRule(securityGroup_albSecurityGroup, ec2.Port.tcp(3000), 'Allow traffic from ALB');
        // Apply removal policy
        securityGroup_XpressBuyServiceSG.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


        // 5. Fargate task execution role
        const role_taskExecutionRole = new iam.Role(this, 'XpressbuyTaskExecutionRole', {
            roleName: 'XpressBuy-Fargate-Task-Execution-Role',
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            // attach the custom policy to the role
        });

        // Make a custom policy for the ECS task execution role
        const customPolicy_ecsTaskExecutionPolicy = new iam.Policy(this, 'xpressbuyECSTaskExecutionPolicy', {
            policyName: 'ecs-task-execution-policy',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "ecr:GetAuthorizationToken",
                        "ecr:BatchCheckLayerAvailability",
                        "ecr:GetDownloadUrlForLayer",
                        "ecr:BatchGetImage",
                        "logs:CreateLogStream",
                        "logs:PutLogEvents",
                        "logs:CreateLogGroup"
                    ],
                    resources: ['*']
                })
            ]
        });

        // Make another custom policy for the ECS task execution role
        const customPolicy_systemsManagerParameterPolicy = new iam.Policy(this, 'XpressBuyReadAccessSystemsManagerParameterStorePolicy', {
            policyName: 'XpressBuy-readAccess-systemsManager-parameterStore-policy',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "ssm:GetParameters",
                        "ssm:GetParameter"
                    ],
                    resources: [`arn:aws:ssm:${this.region}:${this.account}:parameter/xpressbuy/backend/*`]
                })
            ]
        });

        // Attach the custom policy to the ECS task execution role
        role_taskExecutionRole.attachInlinePolicy(customPolicy_ecsTaskExecutionPolicy);
        role_taskExecutionRole.attachInlinePolicy(customPolicy_systemsManagerParameterPolicy);

        // Apply removal policy
        role_taskExecutionRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


        // 6. ECS task role
        const role_taskRole = new iam.Role(this, 'XpressbuyTaskRole', {
            roleName: 'XpressBuy-Fargate-Task-Role',
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        });

        // Make a custom policy for the ECS task role
        const customPolicy_ecsTaskPolicy = new iam.Policy(this, 'xpressbuyECSTaskPolicy', {
            policyName: 'ecs-task-policy',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "ssmmessages:CreateControlChannel",
                        "ssmmessages:OpenControlChannel",
                        "ssmmessages:CreateDataChannel",
                        "ssmmessages:OpenDataChannel",
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:PutLogEvents",
                        "xray:PutTraceSegments",
                        "xray:PutTelemetryRecords"
                    ],
                    resources: ['*']
                })
            ]
        });

        // Attach the custom policy to the ECS task role
        role_taskRole.attachInlinePolicy(customPolicy_ecsTaskPolicy);

        // Apply removal policy
        role_taskRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


        // 6. SSM Parameters
        // NOTE: We need to define these variables so we can reference them in the Task Definition
        const paramAccessKeyID = new ssm.StringParameter(this, 'AWS_ACCESS_KEY_ID', {
            parameterName: '/xpressbuy/backend/AWS_ACCESS_KEY_ID',
            stringValue: process.env.AWS_ACCESS_KEY_ID || '',
            description: 'AWS Access Key ID',

        });
        const paramSecretAccessKeyID = new ssm.StringParameter(this, 'AWS_SECRET_ACCESS_KEY', {
            parameterName: '/xpressbuy/backend/AWS_SECRET_ACCESS_KEY',
            stringValue: process.env.AWS_SECRET_ACCESS_KEY || '',
            description: 'AWS Secret Access Key',
        });
        const paramCognitoUserPoolId = new ssm.StringParameter(this, 'AWS_COGNITO_USER_POOL_ID', {
            parameterName: '/xpressbuy/backend/AWS_COGNITO_USER_POOL_ID',
            stringValue: props.userPoolId,
            description: 'AWS Cognito User Pool ID',
        });
        const paramCognitoUserPoolClientId = new ssm.StringParameter(this, 'AWS_COGNITO_USER_POOL_CLIENT_ID', {
            parameterName: '/xpressbuy/backend/AWS_COGNITO_USER_POOL_CLIENT_ID',
            stringValue: props.userPoolClientId,
            description: 'AWS Cognito User Pool Client ID',
        });
        // Apply removal policy
        paramAccessKeyID.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
        paramSecretAccessKeyID.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
        paramCognitoUserPoolId.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
        paramCognitoUserPoolClientId.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);


        // =============================================================================================
        //  CREATE TASK DEFINITIONS & SERVICES
        // =============================================================================================


        // 1. Create ECS Cluster
        const cluster = new ecs.Cluster(this, 'xpressbuyCluster', {
            clusterName: 'xpressbuy',
            vpc: defaultVpc,
        });


        // --- BACKEND ----------------------------------------------------------------------------------------------

        // 1. Create Dynamic Task Definition
        const backendTaskDef = new ecs.FargateTaskDefinition(this, 'BackendTaskDef', {
            family: 'xpressbuy-backend',
            cpu: 256,
            memoryLimitMiB: 512,
            executionRole: role_taskExecutionRole,
            taskRole: role_taskRole,
        });

        // 2. Add Container (Automates Docker Build & Push)
        const backendContainer = backendTaskDef.addContainer('BackendContainer', {
            containerName: 'backend',
            // CDK will look for a file named "Dockerfile" in the root directory (../../)
            image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../'), {
                file: 'Dockerfile',
                exclude: ['frontend', 'cloudformation', '.journal', 'aws']
            }),
            essential: true,
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: 'backend',
                logGroup: logGroup
            }),
            healthCheck: {
                command: [
                    "CMD-SHELL",
                    "node /bin/node/health-check"
                ],
                interval: cdk.Duration.seconds(30),
                timeout: cdk.Duration.seconds(5),
                retries: 3,
                startPeriod: cdk.Duration.seconds(60),
            },
            portMappings: [{
                name: 'backend',
                containerPort: 5000,
                protocol: ecs.Protocol.TCP,
                appProtocol: ecs.AppProtocol.http
            }],
            environment: {
                "FRONTEND_URL": "*",
                "BACKEND_URL": "*",
                "AWS_DEFAULT_REGION": this.region
            },
            secrets: {
                AWS_ACCESS_KEY_ID: ecs.Secret.fromSsmParameter(paramAccessKeyID),
                AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSsmParameter(paramSecretAccessKeyID),
                AWS_COGNITO_USER_POOL_ID: ecs.Secret.fromSsmParameter(paramCognitoUserPoolId),
                AWS_COGNITO_USER_POOL_CLIENT_ID: ecs.Secret.fromSsmParameter(paramCognitoUserPoolClientId),
            }
        });


        // 3. Create Service
        const backendService = new ecs.FargateService(this, 'BackendService', {
            cluster: cluster,
            desiredCount: 0, 
            enableECSManagedTags: true,
            enableExecuteCommand: true,
            propagateTags: ecs.PropagatedTagSource.SERVICE,
            serviceName: 'xpressbuy-backend',
            taskDefinition: backendTaskDef,
            
            // Updated Service Connect Config
            serviceConnectConfiguration: {
                services: [
                    {
                        portMappingName: 'backend',
                        discoveryName: 'backend',
                    },
                ],
            },
            
            securityGroups: [securityGroup_XpressBuyServiceSG],
            assignPublicIp: true,
            vpcSubnets: defaultVpc.selectSubnets({
                subnetType: ec2.SubnetType.PUBLIC
            }),
        });


        // 4. Create Backend Target Group
        const backendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'XpressbuyBackendTG', {
            vpc: defaultVpc,
            targetGroupName: 'xpressbuy-backend-tg',
            port: 5000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targetType: elbv2.TargetType.IP,
            targets: [backendService], // <--- Connects Service to TG automatically
            healthCheck: {
                path: '/api/v1/health-check',
                interval: cdk.Duration.seconds(30),
                healthyThresholdCount: 3,
            },
        });

        // --- FRONTEND ---------------------------------------------------------------------------------------

        const frontendTaskDef = new ecs.FargateTaskDefinition(this, 'FrontendTaskDef', {
            family: 'xpressbuy-frontend',
            cpu: 256,
            memoryLimitMiB: 512,
            executionRole: role_taskExecutionRole,
            taskRole: role_taskRole,
        });

        const frontendContainer = frontendTaskDef.addContainer('FrontendContainer', {
            containerName: 'frontend',
            image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../frontend')),
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: 'frontend',
                logGroup: logGroup
            }),
            portMappings: [{ containerPort: 3000 }],
        });

        const frontendService = new ecs.FargateService(this, 'FrontendService', {
            cluster: cluster,
            taskDefinition: frontendTaskDef,
            serviceName: 'xpressbuy-frontend',
            securityGroups: [securityGroup_XpressBuyServiceSG],
            assignPublicIp: true,
            desiredCount: 1,
            cloudMapOptions: {
                name: 'frontend',
                cloudMapNamespace: namespace
            }
        });

        // 5. Create Frontend Target Group
        const frontendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'XpressbuyFrontendTG', {
            vpc: defaultVpc,
            targetGroupName: 'xpressbuy-frontend-tg',
            port: 3000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targetType: elbv2.TargetType.IP,
            targets: [frontendService],
            healthCheck: {
                path: '/',
                interval: cdk.Duration.seconds(30),
                healthyThresholdCount: 3,
            },
        });

        // --- LOAD BALANCER LISTENER RULES ---------------------------------------------------------------------------------------

        // 1. Create Load Balancer
        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'XpressbuyALB', {
            vpc: defaultVpc,
            internetFacing: true,
            securityGroup: securityGroup_albSecurityGroup,
            loadBalancerName: 'xpressbuy-backend-alb',
        });

        // 2. Add Backend Listener
        loadBalancer.addListener('BackendListener', {
            port: 5000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            defaultTargetGroups: [backendTargetGroup],
        });

        // 3. Add Frontend Listener
        loadBalancer.addListener('FrontendListener', {
            port: 3000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            defaultTargetGroups: [frontendTargetGroup],
        });

        // 4. Output Load Balancer DNS
        new cdk.CfnOutput(this, 'LoadBalancerDNS', {
            value: loadBalancer.loadBalancerDnsName
        });
    }
}