const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { loginVerification } = require('../middlewares/userLoginVerificationMiddlewares')
const { verifyAccessTokenMiddleware } = require('../middlewares/tokenVerificationMiddlewares')
const { newUserRegistration } = require('../controller/userController')


// routes for /api/v1/tokenVerification

router.post('/verifyIdToken/new-user', loginVerification, newUserRegistration);


router.post('/verifyIdToken', loginVerification, asyncHandler(async (req, res) => {
    res.status(200).json();
}));


router.post('/verifyAccessToken', verifyAccessTokenMiddleware, asyncHandler(async (req, res) => {
    res.status(200).json({isAuthenticated: true});
}));


module.exports = router;