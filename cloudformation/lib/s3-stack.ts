import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class S3Stack extends cdk.Stack {
    // Make the bucket available to other stacks
    public readonly bucket: s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.bucket = new s3.Bucket(this, 'xpressbuyBucket', {
            bucketName: `xpressbuy-bucket-${cdk.Stack.of(this).account}`,
            versioned: false,
            // Server-side encryption with Amazon S3 managed keys (SSE-S3)
            encryption: s3.BucketEncryption.S3_MANAGED,
            bucketKeyEnabled: true,
            // Block all public access
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

            // When you delete a bucket, the data in the bucket is deleted.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // Output values
        new cdk.CfnOutput(this, 'xpressbuyBucketNameExport', {
            value: this.bucket.bucketName,
        });
        new cdk.CfnOutput(this, 'xpressbuyBucketArnExport', {
            value: this.bucket.bucketArn,
        });

    }
}