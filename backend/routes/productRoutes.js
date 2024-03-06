const express = require('express')
const router = express.Router()
const { getAllProducts, getProductsByCategory } = require('../controller/categoryFilterController')
const { getSingleProduct, productVariation } = require('../controller/productDetailsController')

// routes for /api/v1/category
router.get('', getAllProducts)
router.get('/:category_id', getProductsByCategory)
router.get('/product/:product_id', getSingleProduct)
router.get('/:product_id/:colour', productVariation)



module.exports = router;