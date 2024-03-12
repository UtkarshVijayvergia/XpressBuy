const express = require('express')
const router = express.Router()
const { postNewOrder} = require('../controller/userOrdersController')
// const { verifyAccessToken } = require('../middlewares/accessTokenVerification')
// const { verifyIdToken } = require('../middlewares/idTokenVerification')
// const { refreshTokens } = require('../middlewares/refreshTokens')
const { verifyAccessTokenMiddleware } = require('../middlewares/tokenVerificationMiddlewares')

// routes for /api/v1/user
router.post('/:order_id', verifyAccessTokenMiddleware, postNewOrder)


module.exports = router;