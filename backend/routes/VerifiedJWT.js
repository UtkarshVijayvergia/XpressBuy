const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
// const { registerUser, loginUser, getUserDetails, getMe } = require('../controller/userController')
const { verifyIdToken } = require('../middlewares/idTokenVerification')
// const { verifyIdToken } = require('../middlewares/idTokenVerification_nonAwsPackages')

router.post('', verifyIdToken, asyncHandler(async (req, res) => {
    res.status(200).json();
}));


module.exports = router;