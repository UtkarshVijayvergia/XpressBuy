const express = require('express')
const router = express.Router()
const { getSpecialsImages } = require('../controller/DemoImageController')

// routes for /api/v1/image/landingPageImage
router.get('/specials', getSpecialsImages)




module.exports = router;