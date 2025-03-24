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


import * as dotenv from 'dotenv';
dotenv.config();


export class XpressbuyDeploymentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    
        // The code that defines your stack goes here

        // Make a cloudwatch log group
        const logGroup = new logs.LogGroup(this, '/xpressbuy/fargate-cluster', {
            logGroupName: '/xpressbuy/fargate-cluster',
            retention: logs.RetentionDays.ONE_DAY,
        });


        // Create a namespace in aws cloudmap
        const namespace = new servicediscovery.HttpNamespace(this, 'xpressbuy', {
            name: 'xpressbuy',
        });


        // Get the default VPC
        const defaultVpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', {
            isDefault: true, // Ensures the default VPC is used
        });

        
        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'xpressbuyCluster', {
            clusterName: 'xpressbuy',
            vpc: defaultVpc,
        });


        // Create a private ECR repository
        const repository_backend = new ecr.Repository(this, 'BackendXpressbuyRepository', {
            repositoryName: 'backend-xpressbuy',
            imageTagMutability: ecr.TagMutability.MUTABLE,
        });


        // Create a private ECR repository for frontend
        const repository_frontend = new ecr.Repository(this, 'FrontendXpressbuyRepository', {
            repositoryName: 'frontend-xpressbuy',
            imageTagMutability: ecr.TagMutability.MUTABLE,
        });


        // Create a security group for ALB
        const securityGroup_albSecurityGroup = new ec2.SecurityGroup(this, 'XpressbuyAlbSG', {
            vpc: defaultVpc,
            securityGroupName: 'xpressbuy-alb-sg',
            description: 'Security group for XpressBuy ALB',
        });
        securityGroup_albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic');
        securityGroup_albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');


        // Create a new security group for services
        const securityGroup_XpressBuyServiceSG = new ec2.SecurityGroup(this, 'XpressBuyServiceSG', {
            vpc: defaultVpc,
            securityGroupName: 'xpressbuy-srv-sg',
            description: 'Security group for XpressBuy services on ECS',
        });
        // Add an inbound rule to allow HTTP (port 80) traffic from anywhere
        securityGroup_XpressBuyServiceSG.addIngressRule(securityGroup_albSecurityGroup, ec2.Port.tcp(5000), 'Allow traffic from ALB');
        securityGroup_XpressBuyServiceSG.addIngressRule(securityGroup_albSecurityGroup, ec2.Port.tcp(3000), 'Allow traffic from ALB');


        // Create Target Group for Backend
        const backendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'XpressbuyBackendTG', {
            vpc: defaultVpc,
            targetGroupName: 'xpressbuy-backend-tg',
            port: 5000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targetType: elbv2.TargetType.IP,
            healthCheck: {
                path: 'http://xpressbuy-backend-alb-262308006.us-east-1.elb.amazonaws.com:5000/api/v1/health-check',
                interval: cdk.Duration.seconds(30),
                healthyThresholdCount: 3,
            },
        });


        // Create Target Group for Frontend
        const frontendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'XpressbuyFrontendTG', {
            vpc: defaultVpc,
            targetGroupName: 'xpressbuy-frontend-tg',
            port: 3000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targetType: elbv2.TargetType.IP,
            healthCheck: {
                path: '/',
                interval: cdk.Duration.seconds(30),
                healthyThresholdCount: 3,
            },
        });


        // Create Application Load Balancer
        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'XpressbuyALB', {
            vpc: defaultVpc,
            internetFacing: true,
            securityGroup: securityGroup_albSecurityGroup,
            loadBalancerName: 'xpressbuy-backend-alb',
        });


        // Add listeners and routing rules
        const backendListener = loadBalancer.addListener('BackendListener', {
            port: 5000,
            protocol: elbv2.ApplicationProtocol.HTTP,
        });
        backendListener.addTargetGroups('BackendTargetGroup', {
            targetGroups: [backendTargetGroup],
        });

        const frontendListener = loadBalancer.addListener('FrontendListener', {
            port: 3000,
            protocol: elbv2.ApplicationProtocol.HTTP,
        });
        frontendListener.addTargetGroups('FrontendTargetGroup', {
            targetGroups: [frontendTargetGroup],
        });
        
        

        // Create fargate task execution role
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

        
        // Make a custom policy for the ECS task execution role
        const customPolicy_systemsManagerParameterPolicy = new iam.Policy(this, 'XpressBuyReadAccessSystemsManagerParameterStorePolicy', {
            policyName: 'XpressBuy-readAccess-systemsManager-parameterStore-policy',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "ssm:GetParameters",
                        "ssm:GetParameter"
                    ],
                    resources: ['arn:aws:ssm:us-east-1:140023403659:parameter/xpressbuy/backend/*']
                })
            ]
        });


        // Attach the custom policy to the ECS task execution role
        role_taskExecutionRole.attachInlinePolicy(customPolicy_ecsTaskExecutionPolicy);
        role_taskExecutionRole.attachInlinePolicy(customPolicy_systemsManagerParameterPolicy);


        // Create a new task role
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


        // Add variables to ssm parameter store
        new ssm.StringParameter(this, 'AWS_ACCESS_KEY_ID', {
            parameterName: '/xpressbuy/backend/AWS_ACCESS_KEY_ID',
            stringValue: process.env.AWS_ACCESS_KEY_ID || '',
            description: 'Description of another parameter'
        });
        new ssm.StringParameter(this, 'AWS_SECRET_ACCESS_KEY', {
            parameterName: '/xpressbuy/backend/AWS_SECRET_ACCESS_KEY',
            stringValue: process.env.AWS_SECRET_ACCESS_KEY || '',
            description: 'Description of the parameter'
        });
        new ssm.StringParameter(this, 'AWS_COGNITO_USER_POOL_ID', {
            parameterName: '/xpressbuy/backend/AWS_COGNITO_USER_POOL_ID',
            stringValue: process.env.COGNITO_USER_POOL_ID || '',
            description: 'Description of the parameter'
        });
        new ssm.StringParameter(this, 'AWS_COGNITO_USER_POOL_CLIENT_ID', {
            parameterName: '/xpressbuy/backend/AWS_COGNITO_USER_POOL_CLIENT_ID',
            stringValue: process.env.COGNITO_USER_POOL_CLIENT_ID || '',
            description: 'Description of the parameter'
        });
        new ssm.StringParameter(this, 'POSTGRES_CONNECTION_URL', {
            parameterName: '/xpressbuy/backend/POSTGRES_CONNECTION_URL',
            stringValue: process.env.COGNITO_USER_POOL_CLIENT_ID || '',
            description: 'Description of the parameter'
        });
        

        // Things left (for both backend and frontend):
            // Docker image build
            // Push images in ECR
            // Create ECS task definitions
            // Register ECS task definitions
            // Create ECS services

    }
}