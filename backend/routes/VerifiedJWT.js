const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { loginVerification } = require('../middlewares/authVerification')


router.post('', loginVerification, asyncHandler(async (req, res) => {
    res.status(200).json();
}));


module.exports = router;