const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// routes for /api/v1/health-check
router.get('', asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Server is running' });
}));

module.exports = router;