const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");




// @desc    POST new Order
// @route   GET /api/v1/user/order/:order_id
// @access  Private
// TODO: Add Cart Attribute to the Table
const newUserRegistration = asyncHandler(async (req, res) => {
    try {
        const { name, email_id, user_name, address, created_at } = req.body;
        const user_id = req.user_id;
        const putNewUserQuery = new PutCommand({
            TableName: "xpressbuy",
            Item: {
                pk: `USER#${user_id}`,
                sk: `PROFILE#${user_id}`,
                user_id: user_id,
                email_id: email_id,
                name: name,
                user_name: user_name,
                address: {
                    default: address,
                },
                created_at: created_at,
            }
        });
        const response = await dynamodbClient.send(putNewUserQuery);
        console.log("User Registeration Successful");
        res.status(200).json(response);
    } catch (error) {
        console.error("Error Registering User: ", error);
    }
});




module.exports = {
    newUserRegistration,
}