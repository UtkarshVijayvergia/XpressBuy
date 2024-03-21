const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodb = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");


// get a customer's profile's {sk, username, cart} attributes
const query = {
    TableName: "xpressbuy",
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
        ":pk": "CUSTOMER#Alex37",
        ":sk": "ORDER#",
    },
    // ProjectionExpression: "sk, username, cart"
};



router.get('', asyncHandler(async (req, res) => {
    try {
        const command = new QueryCommand(query);
        const response = await dynamodb.send(command);
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
}));


module.exports = router;