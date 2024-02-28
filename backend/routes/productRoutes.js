const express = require('express')
const router = express.Router()
const { getAllProducts, getProductsByCategory } = require('../controller/categoryFilterController')
const { getSingleProduct } = require('../controller/productDetailsController')

// routes for /api/v1/category
router.get('', getAllProducts)
router.get('/:category_id', getProductsByCategory)
router.get('/product/:product_id', getSingleProduct)


module.exports = router;