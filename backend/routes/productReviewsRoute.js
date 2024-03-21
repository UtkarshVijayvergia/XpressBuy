const express = require('express')
const router = express.Router()
const { getReviewsByDate, getReviewsByRating } = require('../controller/productReviewsController')

// routes for /api/v1/category
router.get('/:product_id', getReviewsByDate)
router.get('/:product_id/:review_rating', getReviewsByRating)



module.exports = router;