const express = require('express')
const router = express.Router()
const { getAllCategories } = require('../controller/categoryFilterController')

// routes for /api/v1/category
router.get('', getAllCategories)


module.exports = router;