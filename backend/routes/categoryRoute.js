const express = require('express')
const router = express.Router()
const { getAllProducts, getAllCategories } = require('../controller/categoryFilterController')

// routes for /api/v1/category
router.get('', getAllProducts)
router.get('/category', getAllCategories)


module.exports = router;