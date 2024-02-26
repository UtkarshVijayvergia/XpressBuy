const express = require('express')
const router = express.Router()
const { getAllProducts, getAllCategories, getProductsByCategory } = require('../controller/categoryFilterController')

// routes for /api/v1/category
router.get('', getAllProducts)
router.get('/:category_id', getProductsByCategory)


module.exports = router;