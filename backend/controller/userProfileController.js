const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


// SES
const { SESClient, SendEmailCommand } =  require("@aws-sdk/client-ses");
const sesClient = new SESClient({ region: "ap-south-1" });




// @desc    POST new Order
// @route   GET /api/v1/user/order/:order_id
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    try {
        res.status(200).json({
            email_verified: req.user_details['email_verified'],
            username: req.user_details['preferred_username'],
            name: req.user_details['name'],
            email: req.user_details['email']
        })
    } catch (error) {
        console.error("Error `req.user_details`: ", error);
    }
});



module.exports = {
    getUserProfile,
}