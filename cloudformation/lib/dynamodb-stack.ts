import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb} from 'aws-cdk-lib';

export class DynamodbStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamodb.TableV2(this, 'xpressbuy', {
            tableName: 'xpressbuy',
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            // billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            // billing: dynamodb.Billing.onDemand({
            //     maxReadRequestUnits: 5,
            //     maxWriteRequestUnits: 5,
            // }),
            billing: dynamodb.Billing.provisioned({
                readCapacity: dynamodb.Capacity.fixed(5),
                // writeCapacity can only be configured with autoscaled capacity. 
                writeCapacity: dynamodb.Capacity.autoscaled({ 
                    maxCapacity: 5,
                    minCapacity: 1,
                    // seedCapacity specifies the starting point (initial capacity) when the table is first created;
                    seedCapacity: 2, 
                }),
            }),

            // All user data stored in a DynamoDB table is fully encrypted at rest. When creating an instance 
            // of the TableV2 construct, you can select the following table encryption options:
            // AWS owned keys - Default encryption type. The keys are owned by DynamoDB (no additional charge).
            encryption: dynamodb.TableEncryptionV2.dynamoOwnedKey(),

            // Local secondary indexes
            localSecondaryIndexes: [
                {
                    indexName: 'GSI-1',
                    sortKey: { name: 'GSI1_sk', type: dynamodb.AttributeType.STRING },
                    // projectionType: The non-key attributes that are projected into the secondary index.
                    projectionType: dynamodb.ProjectionType.ALL,
                },
            ],

            // Global secondary indexes
            globalSecondaryIndexes: [
                {
                    indexName: 'GSI-2',
                    partitionKey: { name: 'GSI2_pk', type: dynamodb.AttributeType.STRING },
                    sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
                    // projectionType: The non-key attributes that are projected into the secondary index.
                    projectionType: dynamodb.ProjectionType.ALL,
                },
            ],

            dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
            // Warm throughput can not be decreased below the capacity that is currently in use.
            // TODO: Uncomment the following code to enable warm throughput
            // warmThroughput: {
            //     readUnitsPerSecond: 5,
            //     writeUnitsPerSecond: 5,
            // },

            // When you delete a table, the data in the table is deleted. 
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        

        // Output the table name and arn
        new cdk.CfnOutput(this, 'TableName', {
            value: table.tableName,
        });
        new cdk.CfnOutput(this, 'TableArn', {
            value: table.tableArn,
        });
    }
}