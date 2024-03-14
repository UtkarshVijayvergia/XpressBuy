const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// routes for /api/v1/health-check
router.get('/colour/:colour', asyncHandler(async (req, res) => {
    const { colour } = req.params;
    const response = await fetch(`https://colornames.org/search/json/?hex=${colour}`);
    const data = await response.json();
    res.status(200).json(data);
}));

module.exports = router;