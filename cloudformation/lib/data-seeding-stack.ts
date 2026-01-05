import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_s3_deployment as s3deploy } from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as path from 'path';
import * as fs from 'fs';

// Props for the seeding stack
interface DataSeedingStackProps extends cdk.StackProps {
    s3Bucket: s3.IBucket;
    dynamoTable: dynamodb.ITableV2;
}

export class DataSeedingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: DataSeedingStackProps) {
        super(scope, id, props);

        // =============================================================================================
        //  S3 BUCKET DEPLOYMENT - Automatically uploads files from 's3 content' folder
        // =============================================================================================

        new s3deploy.BucketDeployment(this, 'DeployProductImages', {
            sources: [s3deploy.Source.asset(path.join(__dirname, '../../s3 content'))],
            destinationBucket: props.s3Bucket,
            // Prune: false means keep existing files that aren't in the source
            prune: false,
            // Memory limit for the Lambda that does the upload
            memoryLimit: 512,
            // Log retention for debugging
            logRetention: logs.RetentionDays.ONE_DAY,
        });


        // =============================================================================================
        //  DYNAMODB SEEDING - Uses a Custom Resource with inline Lambda
        // =============================================================================================

        // Read all the seed data files and combine them
        const dataPath = path.join(__dirname, '../../bin/data');
        const seedData: any[] = [];

        // Read product files
        const productFiles = ['product1.json', 'product2.json', 'product3.json', 'product4.json', 'product5.json'];
        for (const file of productFiles) {
            const filePath = path.join(dataPath, 'products', file);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const items = JSON.parse(fileContent);
                seedData.push(...items);
            }
        }

        // Read categories
        const categoriesPath = path.join(dataPath, 'categories', 'categories.json');
        if (fs.existsSync(categoriesPath)) {
            const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');
            const categories = JSON.parse(categoriesContent);
            seedData.push(...categories);
        }

        // Read Customer Data - Read both customer files
        const customerFiles = ['sample_customer_data.json', 'sample_customer_data2.json'];
        for (const file of customerFiles) {
            const customerFilePath = path.join(dataPath, 'customers', file);
            if (fs.existsSync(customerFilePath)) {
                const customerContent = fs.readFileSync(customerFilePath, 'utf8');
                const customers = JSON.parse(customerContent);
                seedData.push(...customers);
            }
        }

        // Create a Lambda function to seed data
        const seedLambda = new lambda.Function(this, 'DynamoDBSeedFunction', {
            functionName: 'xpressbuy-dynamodb-seed',
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'index.handler',
            timeout: cdk.Duration.minutes(5),
            memorySize: 256,
            code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Only run on Create (not Update or Delete)
    if (event.RequestType === 'Delete') {
        return { PhysicalResourceId: event.PhysicalResourceId || 'seed-complete' };
    }
    
    const tableName = event.ResourceProperties.TableName;
    const seedData = JSON.parse(event.ResourceProperties.SeedData);
    
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    
    console.log(\`Seeding \${seedData.length} items to table: \${tableName}\`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of seedData) {
        try {
            await docClient.send(new PutCommand({
                TableName: tableName,
                Item: item,
                // Don't overwrite if item already exists
                ConditionExpression: 'attribute_not_exists(pk)'
            }));
            successCount++;
        } catch (error) {
            if (error.name === 'ConditionalCheckFailedException') {
                // Item already exists, skip
                console.log(\`Item already exists: \${item.pk} / \${item.sk}\`);
            } else {
                console.error(\`Error inserting item: \${error.message}\`);
                errorCount++;
            }
        }
    }
    
    console.log(\`Seeding complete. Success: \${successCount}, Skipped/Errors: \${errorCount}\`);
    
    return {
        PhysicalResourceId: 'seed-complete',
        Data: {
            SuccessCount: successCount,
            ErrorCount: errorCount
        }
    };
};
            `),
            environment: {
                TABLE_NAME: props.dynamoTable.tableName,
            },
        });

        // Grant Lambda permission to write to DynamoDB
        props.dynamoTable.grantWriteData(seedLambda);

        // Create Custom Resource Provider
        const provider = new cr.Provider(this, 'SeedProvider', {
            onEventHandler: seedLambda,
            logRetention: logs.RetentionDays.ONE_DAY,
        });

        // Create the Custom Resource that triggers seeding
        new cdk.CustomResource(this, 'SeedDynamoDB', {
            serviceToken: provider.serviceToken,
            properties: {
                TableName: props.dynamoTable.tableName,
                SeedData: JSON.stringify(seedData),
                // Change this value to re-trigger seeding (updated to include customer data)
                Version: '2.0.0',
            },
        });

        // Output
        new cdk.CfnOutput(this, 'SeedDataCount', {
            value: seedData.length.toString(),
            description: 'Number of items seeded to DynamoDB',
        });
    }
}
