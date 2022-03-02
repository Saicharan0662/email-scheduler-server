const express = require('express');
const router = express.Router();

const {
    register,
    login,
    activateAccount,
    googleSignup,
    googleLogin
} = require('../controlers/auth')

router.route('/register').post(register)
router.route('/activate/:clientToken').patch(activateAccount)
router.route('/login').post(login)
router.route('/googleSignup').post(googleSignup)
router.route('/googleLogin').post(googleLogin)

module.exports = router