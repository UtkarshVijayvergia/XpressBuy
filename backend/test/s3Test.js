const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// S3
const s3Client = require('../db/s3/s3Config')
const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



const imageNames = [
    "0e8ce2f5-8ea9-43d8-b5a7-b00233f9e9b4.jpg",
    "0e8ce2f5-8ea9-43d8-b5a7-b00233f9e9b4#707271.jpg",
    "0e8ce2f5-8ea9-43d8-b5a7-b00233f9e9b4#DEB894.jpg",
    "0e8ce2f5-8ea9-43d8-b5a7-b00233f9e9b4#FFFFFF.jpg",
];

router.get('', asyncHandler(async (req, res) => {
    try {
        let imageUrls = [];
        for(const imageName of imageNames) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME, 
                Key: imageName 
            };
            const command = new GetObjectCommand(params);
            
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            imageUrls.push(url);
        }
        res.status(200).json(imageUrls);
    } catch (error) {
        console.error(error);
    }
}));


// router.post('', asyncHandler(async (req, res) => {
//     try {
//         // set the parameters for the S3 bucket and the image to be uploaded to the bucket
//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME,    // Name of the bucket
//             Key: req.file.originalname, // File name you want to save as in S3
//             Body: req.file.buffer,  // Buffer of the file
//             ContentType: req.file.mimetype, // MIME type of the file
//         };
//         const command = new PutObjectCommand(params);
//         const response = await s3Client.send(command);
//         res.status(200).json(response);
//     } catch (error) {
//         console.error(error);
//     }
// }));



module.exports = router;