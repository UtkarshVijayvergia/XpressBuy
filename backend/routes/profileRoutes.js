const express = require('express')
const router = express.Router()
const { getUserProfile } = require('../controller/userProfileController');
const { verifyIdTokenMiddleware } = require('../middlewares/tokenVerificationMiddlewares');


// routes for /api/v1/profile
router.get('', verifyIdTokenMiddleware, getUserProfile)



module.exports = router;