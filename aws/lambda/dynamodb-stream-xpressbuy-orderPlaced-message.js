const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");


// const dynamodbClient = require('../db/dynamodb/db')
const dynamodbClient = new DynamoDBDocumentClient({ region: "ap-south-1" });
const sesClient = new SESClient({ region: "ap-south-1" });


exports.handler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            const newItem = record.dynamodb.NewImage;
            const partitionKey = newItem.partitionKey;
            const sortKey = newItem.sortKey;

            if (partitionKey.startsWith('USER') && sortKey.startsWith('ORDER')) {
                const user_id = partitionKey.split('#')[1];
                const profileItemParams = {
                    TableName: "your-table-name",
                    Key: {
                        "pk": `USER#${user_id}`,
                        "sk": `PROFILE#${user_id}`,
                    },
                    ProjectionExpression: "email_id"
                };

                try {
                    const profileItem = await dynamodbClient.send(new GetCommand(profileItemParams));

                    // Check if the email_id attribute exists in the response
                    if (profileItem.Item && profileItem.Item.email_id) {
                        const emailParams = {
                            Destination: {
                                ToAddresses: [profileItem.Item.email_id],
                            },
                            Message: {
                                Body: {
                                    Text: { Data: "A new order has been placed." },
                                },
                                Subject: { Data: "New Order Notification" },
                            },
                            Source: "utkarsh.v1901@gmail.com",
                            ReplyToAddresses: [
                                "utkarsh.v1901@gmail.com"
                            ],
                        };

                        // Send the email
                        const emailResponse = await sesClient.send(new SendEmailCommand(emailParams));
                        console.log("Email sent", emailResponse);
                    }
                } catch (error) {
                    console.error("Failed to get the item or send the email", error);
                }
            }
        }
    }
};
