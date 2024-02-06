const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const pool = require('../db/postgres/db.js')
// const { registerUser, loginUser, getUserDetails, getMe } = require('../controller/userController')

router.get('', asyncHandler(async (req, res) => {
    // console.log(pool);
    const client = await pool.connect()
    // console.log(client);
    try {
        const { rows } = await client.query('SELECT * FROM users')
        console.log(rows);
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    } finally {
        client.release()
    }
}));


module.exports = router;