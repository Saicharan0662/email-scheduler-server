const express = require('express');
const router = express.Router();

const {
    register,
    login,
    activateAccount,
} = require('../controlers/auth')

router.route('/register').post(register)
router.route('/activate/:clientToken').patch(activateAccount)
router.route('/login').post(login)

module.exports = router