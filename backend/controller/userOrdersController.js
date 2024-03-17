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
// @route   GET /api/v1/user/order/:order_id
// @access  Private
const postNewOrder = asyncHandler(async (req, res) => {
    try {
        const { order_id, product_details, total_amount, shipping_address, created_at } = req.body;
        const user_id = req.user_id;
        console.log(user_id)
        const putNewOrderQuery = new PutCommand({
            TableName: "xpressbuy",
            Item: {
                pk: `USER#${user_id}`,
                sk: `ORDER#${order_id}`,
                user_id: user_id,
                order_id: order_id,
                product_details: product_details,
                total_amount: total_amount,
                shipping_address: shipping_address,
                status: "PENDING",
                created_at: created_at,
                GSI1_SK: `PENDING#${order_id}`,
            }
        });
        const response = await dynamodbClient.send(putNewOrderQuery);
        console.log("Order Placed Successfully!");
        // emailOrderConfirmation(user_id);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error order placing: ", error);
    }
});




const emailOrderConfirmation = async ( user_id ) => {
    const getProfileItem = new GetCommand({
        TableName: "xpressbuy",
        Key: {
            "pk": `USER#${user_id}`,
            "sk": `PROFILE#${user_id}`,
        },
        ProjectionExpression: "email_id"
    });

    try {
        const profileItem = await dynamodbClient.send(getProfileItem);
        console.log("profileItem: ", profileItem);
        // console.log("profileItem.Item: ", profileItem.Item);
        console.log("profileItem.Item: ", profileItem.Item);

        // Check if the email_id attribute exists in the response
        if (profileItem.Item && profileItem.Item.email_id) {
            console.log("Inside Email");
            const emailParams = new SendEmailCommand({
                Destination: {
                    ToAddresses: [profileItem.Item.email_id],
                },
                Message: {
                    Body: {
                        Text: { Data: "A new order has been placed." },
                    },
                    Subject: { Data: "New Order Notification" },
                },
                Source: "utkarsh.v1901@gmail.com",
                // ReplyToAddresses: [
                //     "utkarsh.v1901@gmail.com"
                // ],
            });

            // Send the email
            console.log("sending email")
            const emailResponse = await sesClient.send(emailParams);
            console.log("Email sent", emailResponse);
        }
    } catch (error) {
        console.error("Failed to get the item or send the email", error);
    }
}



module.exports = {
    // getSingleProduct,
    postNewOrder,
}