const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// When running in ECS, the SDK automatically uses the task role credentials.
// When running locally, it uses credentials from ~/.aws/credentials or environment variables.
const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1'
});
const docClient = DynamoDBDocumentClient.from(client);


module.exports = docClient;