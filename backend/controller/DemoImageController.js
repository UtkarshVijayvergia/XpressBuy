const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");




// @desc    Get Single Product
// @route   GET /api/v1/image/landingPageImage/specials
// @access  Public
const getSpecialsImages = asyncHandler(async (req, res) => {
    try {
        const listParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: 'LandingPageImages/' // specify the folder
        };
        const listObjectsCommand = new ListObjectsV2Command(listParams);
        const response = await s3Client.send(listObjectsCommand);
        response.Contents.shift(); // remove the folder name from the list
        const imageUrls = await Promise.all(
            response.Contents.map(async (file) => {
                const getImageParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: file.Key
                };
                const getImageCommand = new GetObjectCommand(getImageParams);
                const imageURL = await getSignedUrl(s3Client, getImageCommand, { expiresIn: 3600 });
                return imageURL;
            })
        );

        res.status(200).json(imageUrls);
    } catch (error) {
        console.error(error);
    }
});


// const getSpecialsImages = asyncHandler(async (req, res) => {
//     try {
//         const imageName = ``;
//         const getImageParams = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: imageName
//         };
//         const getImageCommand = new GetObjectCommand(getImageParams);
//         const imageURL = await getSignedUrl(s3Client, getImageCommand, { expiresIn: 3600 });
//         res.status(200).json(response.Items);
//     } catch (error) {
//         console.error(error);
//     }
// });



// @desc    Get Single Product Variation
// @route   GET /api/v1/products/:product_id/:colour/
// @access  Public
// const productVariation = asyncHandler(async (req, res) => {
//     try {
//         const { product_id, colour } = req.params;
//         const getSingleProductVariationQuery = new QueryCommand({
//             TableName: "xpressbuy",
//             KeyConditionExpression: "pk = :pk and sk = :sk",
//             ExpressionAttributeValues: {
//                 ":pk": `PRODUCT#${product_id}`,
//                 ":sk": `COLOUR#${colour}`,
//             },
//             ProjectionExpression: "product_id, product_colour, size_variation"
//         });
//         const response = await dynamodbClient.send(getSingleProductVariationQuery);
//         res.status(200).json(response.Items);
//     } catch (error) {
//         console.error(error);
//     }
// });



module.exports = {
    getSpecialsImages,
}