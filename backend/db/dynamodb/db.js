const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

// Set the endpoint to the local dynamodb
let attrs = {
    endpoint: 'http://localhost:8000'
};
// Create a new client
const client = new DynamoDBClient(attrs);

module.exports = client;