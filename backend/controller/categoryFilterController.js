const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


// Get all Products
const getCategoryProducts = {
    TableName: "xpressbuy",
    KeyConditionExpression: "pk = :pk and sk = :sk",
    ExpressionAttributeValues: {
        ":pk": "CATEGORY",
        ":sk": "EVERYTHING",
    },
};


const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const getAllProductsQuery = new QueryCommand(getCategoryProducts);
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
                ExpressionAttributeNames: {
                    "#product_name": "name",
                },
                ProjectionExpression: "product_id, reviews, purchases, #product_name, rating"
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



module.exports = {
    getAllProducts,
}