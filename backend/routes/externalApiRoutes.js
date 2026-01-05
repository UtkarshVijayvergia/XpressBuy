const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

// routes for /external/colour/:colour
router.get('/colour/:colour', asyncHandler(async (req, res) => {
    try {
        const { colour } = req.params;
        const response = await fetch(`https://colornames.org/search/json/?hex=${colour}`);
        if (!response.ok) {
            console.log(`Colour API failed for ${colour}: ${response.status}`);
            // Return a default response if external API fails
            return res.status(200).json({ hexCode: colour, name: null });
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching colour name:', error);
        // Return a fallback response
        res.status(200).json({ hexCode: req.params.colour, name: null });
    }
}));

module.exports = router;