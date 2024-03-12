const asyncHandler = require('express-async-handler')

// dynamodb 
const dynamodbClient = require('../db/dynamodb/db')
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");




// @desc    Get Single Product
// @route   GET /api/v1/product/products/:product_id
// @access  Public
// const getSingleProduct = asyncHandler(async (req, res) => {
//     try {
//         const product_id = req.params.product_id;
//         const getSingleProductQuery = new QueryCommand({
//             TableName: "xpressbuy",
//             KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
//             ExpressionAttributeValues: {
//                 ":pk": `PRODUCT#${product_id}`,
//                 ":sk": `PRODUCT#${product_id}`,
//             },
//             ProjectionExpression: "product_id, product_reviews, product_price, product_sold, product_name, product_rating, product_description, current_colour, available_colours"
//         });
//         const response = await dynamodbClient.send(getSingleProductQuery);
//         const imageName = `${product_id}.jpg`;
//         const getImageParams = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: imageName
//         };
//         const getImageCommand = new GetObjectCommand(getImageParams);
//         const imageURL = await getSignedUrl(s3Client, getImageCommand, { expiresIn: 3600 });
//         response.Items[0].base_imageURL = imageURL;
//         for(const color of response.Items[0].available_colours) {
//             const itemImageName = `${product_id}${color}.jpg`;
//             const getItemImageParams = {
//                 Bucket: process.env.AWS_BUCKET_NAME,
//                 Key: itemImageName
//             };
//             const getItemImageCommand = new GetObjectCommand(getItemImageParams);
//             const itemImageURL = await getSignedUrl(s3Client, getItemImageCommand, { expiresIn: 3600 });
//             response.Items[0][`${color}_imageURL`] = itemImageURL;
//         }
//         res.status(200).json(response.Items);
//     } catch (error) {
//         console.error(error);
//     }
// });



// @desc    POST new Order
// @route   GET /api/v1/user/:user_id/order/:order_id/
// @access  Private
const postNewOrder = asyncHandler(async (req, res) => {
    try {
        // product_id, color_id, size_id, product_quantity, product_price, total_amount
        // const { user_id, order_id, items, total_amount, shipping_address, created_at } = req.body;
        // const putNewOrderQuery = new PutCommand({
        //     TableName: "xpressbuy",
        //     Item: {
        //         pk: `USER#${user_id}`,
        //         sk: `ORDER#${order_id}`,
        //         user_id: user_id,
        //         order_id: order_id,
        //         items: items,
        //         total_amount: total_amount,
        //         shipping_address: shipping_address,
        //         status: "PENDING",
        //         created_at: created_at,
        //         GSI1_SK: `PENDING#${order_id}`
        //     }
        // });
        // const response = await dynamodbClient.send(putNewOrderQuery);
        // res.status(200).json(response.Items);
        // console.log(req.body);
        // console.log("--------------------");
        // console.log(req.headers);
        // console.log("--------------------");
        // console.log(req.cookies);
        console.log("--------------------");
        console.log(req.user_id);
        console.log("--------------------");
        console.log("refreshed token");
        res.status(200).json();
    } catch (error) {
        console.error(error);
    }
});



module.exports = {
    // getSingleProduct,
    postNewOrder,
}