const express = require('express')
const router = express.Router()
const { postNewOrder} = require('../controller/userOrdersController')
const { verifyAccessTokenMiddleware } = require('../middlewares/tokenVerificationMiddlewares')

// routes for /api/v1/order
router.post('/:order_id', verifyAccessTokenMiddleware, postNewOrder)


module.exports = router;