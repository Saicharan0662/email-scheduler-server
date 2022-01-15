const nodemailer = require('nodemailer');
const cron = require('node-cron');

const scheduleEmail = async (req, res) => {
    // params from body
    // email: subject, to, body, attachments, data-time
    res.send('email scheduled')
}

module.exports = {
    scheduleEmail
}