const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");




// @desc    Get Cart Items
// @route   GET /api/v1/user/:user_id/cart
// @access  Private
const getSingleProduct = asyncHandler(async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const getUserCartQuery = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
            ExpressionAttributeValues: {
                ":pk": `USER#${user_id}`,
                ":sk": `PROFILE#${user_id}`,
            },
            ProjectionExpression: "cart"
        });
        const response = await dynamodbClient.send(getUserCartQuery);
        for (let i = 0; i < response.Items['cart'].length; i++) {
            const product_id = response.Items[i].product_id;
            const color_id = response.Items[i].colour;
            const productImageName = `${product_id}${color_id}.jpg`;
            const getProductImageParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: productImageName
            };
            const getProductImageCommand = new GetObjectCommand(getProductImageParams);
            const productImageURL = await getSignedUrl(s3Client, getProductImageCommand, { expiresIn: 3600 });
            response.Items[cart][i][`${product_id}${color_id}_imageURL`] = productImageURL;
        }
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
});



// @desc    POST Product to Cart
// @route   POST /api/v1/user/:user_id/cart/:product_id/:color_id/:product_size/:product_quantity
// @access  Public
const addToCart = asyncHandler(async (req, res) => {
    try {
        const { user_id, product_id, color_id, product_size, product_quantity } = req.params;
        const addProductToCart = new UpdateCommand({
            TableName: "xpressbuy",
            Key: {
                "pk": `USER#${user_id}`,
                "sk": `PROFILE#${user_id}`,
            },
            UpdateExpression: "set #cart = list_append(#cart, :product)",
            ExpressionAttributeNames: {
                "#cart": "cart"
            },
            ExpressionAttributeValues: {
                ":product": [
                    {
                        "product_id": product_id,
                        "color_id": color_id,
                        "product_size": product_size,
                        "product_quantity": product_quantity,
                    }
                ]
            },
            ReturnValues: "UPDATED_NEW"
        });
        const response = await dynamodbClient.send(addProductToCart);
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
});



module.exports = {
    getSingleProduct,
    addToCart,
}