const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Set the endpoint to the local dynamodb
let attrs = {
    endpoint: 'https://dynamodb.ap-south-1.amazonaws.com'
};
// Create a new client
const client = new DynamoDBClient(attrs);
const docClient = DynamoDBDocumentClient.from(client);


module.exports = docClient;