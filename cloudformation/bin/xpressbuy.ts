#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { XpressbuyStack } from '../lib/xpressbuy-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { DynamodbStack } from '../lib/dynamodb-stack';
import { S3Stack } from '../lib/s3-stack';
import { XpressbuyIamStack } from '../lib/xpressbuy-iam-stack';
import { XpressbuyDeploymentStack } from '../lib/xpressbuy-deployment-stack';
import { DataSeedingStack } from '../lib/data-seeding-stack';

const app = new cdk.App();


new XpressbuyStack(app, 'XpressbuyStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});


// Capture the CognitoStack in a variable
const cognitoStack = new CognitoStack(app, 'CognitoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});


// Capture DynamodbStack to pass table to deployment
const dynamodbStack = new DynamodbStack(app, 'DynamodbStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const s3Stack = new S3Stack(app, 'S3Stack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new XpressbuyIamStack(app, 'XpressbuyIamStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  bucketName: s3Stack.bucket.bucketName,
});

new XpressbuyDeploymentStack(app, 'XpressbuyDeploymentStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  // Passing Cognito props
  userPoolId: cognitoStack.userPool.userPoolId,
  userPoolClientId: cognitoStack.userPoolClient.userPoolClientId,
  // Pass S3 bucket and DynamoDB table for IAM permissions
  s3Bucket: s3Stack.bucket,
  dynamoTable: dynamodbStack.table,
});

// Data Seeding Stack - Seeds S3 images and DynamoDB data automatically
new DataSeedingStack(app, 'DataSeedingStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  s3Bucket: s3Stack.bucket,
  dynamoTable: dynamodbStack.table,
});