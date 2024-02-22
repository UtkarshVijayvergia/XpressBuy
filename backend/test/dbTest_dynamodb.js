const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodb = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");


// get a customer's profile's {sk, username, cart} attributes
const query = {
    TableName: "xpressbuy",
    KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
    ExpressionAttributeValues: {
        ":pk": { S: "CUSTOMER#Alex37" },
        ":sk": { S: "PROFILE#" },
    },
    ProjectionExpression: "sk, username, cart"
};



router.get('', asyncHandler(async (req, res) => {
    try {
        const command = new QueryCommand(query);
        const response = await dynamodb.send(command);
        // Transform the data
        const transformedItems = response.Items.map(item => unmarshall(item));
        res.status(200).json(transformedItems);
    } catch (error) {
        console.error(error);
    }
}));


module.exports = router;