import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_iam as iam } from 'aws-cdk-lib';


interface XpressbuyIamStackProps extends cdk.StackProps {
    bucketName: string;
}


export class XpressbuyIamStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: XpressbuyIamStackProps) {
        super(scope, id, props);

        const S3ReadOnlyGroup = new iam.Group(this, 'S3ReadOnlyGroup', {
            groupName: 'S3-ReadOnly',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')
            ]
        });

        const XRayGroup = new iam.Group(this, 'XRayGroup', {
            groupName: 'X-Ray',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXrayFullAccess')
            ]
        });

        // Get the user "utkarsh" from the IAM
        const utkarshUser = iam.User.fromUserName(this, 'UtkarshUser', 'utkarsh');

        // Add user "utkarsh" to the S3ReadOnlyGroup. The user already exists in the IAM.
        S3ReadOnlyGroup.addUser(utkarshUser);

        // Add user "utkarsh" to the XRayGroup. The user already exists in the IAM.
        XRayGroup.addUser(utkarshUser);


        // Make a new custom policy
        const customPolicy_S3Access = new iam.Policy(this, 'xpressbuy-S3-crudAccess', {
            policyName: 'xpressbuy-S3-crudAccess',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:DeleteObject"
                    ],
                    resources: [`arn:aws:s3:::${props.bucketName}/*`]
                })
            ]
        });

        // Make a new user "XpressBuy" in the IAM
        const User_xpressBuy = new iam.User(this, 'XpressBuy', {
            userName: 'XpressBuy'
        });

        // Attach the custom policy to the user "XpressBuy"
        User_xpressBuy.attachInlinePolicy(customPolicy_S3Access);

    }
}