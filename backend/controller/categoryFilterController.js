const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");




// @desc    Get all products
// @route   GET /api/v1/category
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const getAllProductsQuery = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk and sk = :sk",
            ExpressionAttributeValues: {
                ":pk": "CATEGORY",
                ":sk": "1#EVERYTHING",
            },
            ProjectionExpression: "product_ids"
        });
        const products = await dynamodbClient.send(getAllProductsQuery);
        let product_info = [];
        for (const product of products.Items[0].product_ids) {
            const getSingleProductQuery = new QueryCommand({
                TableName: "xpressbuy",
                KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
                ExpressionAttributeValues: {
                    ":pk": `PRODUCT#${product}`,
                    ":sk": `PRODUCT#${product}`,
                },
                // ExpressionAttributeNames: {
                //     "#product_name": "name",
                // },
                ProjectionExpression: "product_id, product_reviews, product_price, product_sold, product_name, product_rating"
            });
            const response = await dynamodbClient.send(getSingleProductQuery);
            const imageName = `${product}.jpg`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName
            };
            const command = new GetObjectCommand(params);
            const imageURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            response.Items[0].imageURL = imageURL;
            product_info.push(response.Items);
        }
        res.status(200).json(product_info);
    } catch (error) {
        console.error(error);
    }
});




// @desc    Get all categories
// @route   GET /api/v1/category
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getAllCategoriesQuery = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": "CATEGORY",
            },
            ProjectionExpression: "sk, product_quantity"
        });
        const categories = await dynamodbClient.send(getAllCategoriesQuery);
        res.status(200).json(categories.Items);
    } catch (error) {
        console.error(error);
    }
});



module.exports = {
    getAllProducts,
    getAllCategories,
}