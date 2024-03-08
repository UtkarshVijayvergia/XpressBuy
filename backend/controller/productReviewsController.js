const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");




// @desc    Get Single Product All Reviews in date order
// @route   GET /api/v1/reviews/:product_id
// @access  Public
const getReviewsByDate = asyncHandler(async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const getProductReview = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
            ExpressionAttributeValues: {
                ":pk": `PRODUCT#${product_id}`,
                ":sk": `REVIEW#`,
            },
            ProjectionExpression: "product_rating, created_at, GSI2_pk, review_id"
        });
        const response = await dynamodbClient.send(getProductReview);
        console.log(response.Items[0]);
        for(let i = 0; i < response.Items.length; i++) {
            const review_id = response.Items[i].review_id;
            const reviewImageName = `${product_id}#${review_id}.jpg`;
            const getReviewImageParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: reviewImageName
            };
            const getReviewImageCommand = new GetObjectCommand(getReviewImageParams);
            const reviewImageURL = await getSignedUrl(s3Client, getReviewImageCommand, { expiresIn: 3600 });
            response.Items[i][`${review_id}_imageURL`] = reviewImageURL;
        }
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
});



// @desc    Get Single Product All Reviews by Rating in date order
// @route   GET /api/v1/reviews/:product_id/:rating_rating
// @access  Public
const getReviewsByRating = asyncHandler(async (req, res) => {
    try {
        const { product_id, rating_point } = req.params;
        const getSingleProductVariationQuery = new QueryCommand({
            TableName: "xpressbuy",
            KeyConditionExpression: "pk = :pk and sk = :sk",
            ExpressionAttributeValues: {
                ":pk": `PRODUCT#${product_id}`,
                ":sk": `REVIEW#${rating_point}`,
            },
            ProjectionExpression: "product_rating, created_at, GSI2_pk, review_id"
        });
        const response = await dynamodbClient.send(getSingleProductVariationQuery);
        for(let i = 0; i < response.Items.length; i++) {
            const review_id = response.Items[i].review_id;
            const reviewImageName = `${product_id}#${review_id}.jpg`;
            const getReviewImageParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: reviewImageName
            };
            const getReviewImageCommand = new GetObjectCommand(getReviewImageParams);
            const reviewImageURL = await getSignedUrl(s3Client, getReviewImageCommand, { expiresIn: 3600 });
            response.Items[i][`${review_id}_imageURL`] = reviewImageURL;
        }
        res.status(200).json(response.Items);
    } catch (error) {
        console.error(error);
    }
});



module.exports = {
    getReviewsByDate,
    getReviewsByRating,
}