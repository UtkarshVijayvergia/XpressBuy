const express = require('express')
const router = express.Router()
const { postNewOrder} = require('../controller/userOrdersController')
const { verifyAccessToken } = require('../middlewares/accessTokenVerification')
const { verifyIdToken } = require('../middlewares/idTokenVerification')

// routes for /api/v1/user
router.post('/:order_id', verifyAccessToken, postNewOrder)



module.exports = router;