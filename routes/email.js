const express = require('express');
const router = express.Router();

const { scheduleEmail } = require('../controlers/email')

router.route('/').post(scheduleEmail)

module.exports = router