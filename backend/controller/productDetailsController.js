const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");




// @desc    Get Single Product
// @route   GET /api/v1/product/products/:product_id
// @access  Public
const getSingleProduct = asyncHandler(async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const getSingleProductQuery = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
            ExpressionAttributeValues: {
                ":pk": `PRODUCT#${product_id}`,
                ":sk": `PRODUCT#${product_id}`,
            },
            ProjectionExpression: "product_id, product_reviews, product_price, product_sold, product_name, product_rating, product_description, current_colour, available_colours"
        });
        const response = await dynamodbClient.send(getSingleProductQuery);
        const imageName = `${product_id}.jpg`;
        const getImageParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName
        };
        const getImageCommand = new GetObjectCommand(getImageParams);
        const imageURL = await getSignedUrl(s3Client, getImageCommand, { expiresIn: 3600 });
        response.Items[0].base_imageURL = imageURL;
        for(const color of response.Items[0].available_colours) {
            const itemImageName = `${product_id}${color}.jpg`;
            const getItemImageParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: itemImageName
            };
            const getItemImageCommand = new GetObjectCommand(getItemImageParams);
            const itemImageURL = await getSignedUrl(s3Client, getItemImageCommand, { expiresIn: 3600 });
            response.Items[0][`${color}_imageURL`] = itemImageURL;
        }
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
});



// @desc    Get Single Product
// @route   GET /api/v1/product/products/:product_id/:colour/:size
// @access  Public
const productVariation = asyncHandler(async (req, res) => {
    try {
        const { product_id, colour, size } = req.params;
        const colourCAPS = colour.toUpperCase();
        const getSingleProductVariationQuery = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk and sk = :sk",
            ExpressionAttributeValues: {
                ":pk": `PRODUCT#${product_id}`,
                ":sk": `COLOUR#${colourCAPS}#SIZE#${size}`,
            },
            ProjectionExpression: "product_id, product_colour, product_size, product_stock, product_sold "
        });
        const response = await dynamodbClient.send(getSingleProductVariationQuery);
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
});



module.exports = {
    getSingleProduct,
    productVariation,
}