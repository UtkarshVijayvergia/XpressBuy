const { S3Client } = require("@aws-sdk/client-s3");

// When running in ECS, the SDK automatically uses the task role credentials.
// When running locally, it uses credentials from ~/.aws/credentials or environment variables.
const client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1'
});


module.exports = client;