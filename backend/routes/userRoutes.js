const express = require('express')
const router = express.Router()
const { newUserRegistration } = require('../controller/userController')

// routes for /api/v1/user
router.post('/newUser', newUserRegistration)



module.exports = router;