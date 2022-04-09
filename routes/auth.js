const express = require('express');
const router = express.Router();

const {
    register,
    login,
    activateAccount,
    resetPasswordEmail,
    resetPassword,
    googleSignup,
    googleLogin
} = require('../controlers/auth')

router.route('/register').post(register)
router.route('/activate/:clientToken').patch(activateAccount)
router.route('/login').post(login)
router.route('/reset-password-email').post(resetPasswordEmail)
router.route('/googleSignup').post(googleSignup)
router.route('/googleLogin').post(googleLogin)
router.route('/reset-password/:token').patch(resetPassword)

module.exports = router