const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const scheduleEmail = async (req, res) => {
    const { userEmail, userPassword, email, schedule } = req.body
    if (!userEmail || !userPassword || !email || !schedule)
        throw new BadRequestError(`Please provide the values`)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userEmail,
            pass: userPassword
        }
    });

    const mailOptions = {
        from: userEmail,
        to: email.to,
        subject: email.subject,
        html: `<p>${email.body}</p>`
    };

    const month = new Date(schedule).getMonth()
    const date = new Date(schedule).getDate()
    const hours = new Date(schedule).getHours()
    const minutes = new Date(schedule).getMinutes()

    try {
        const task = cron.schedule(`*/${minutes} */${hours} */${date} */${month + 1} *`, () => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    task.stop()
                } else {
                    console.log('Email sent: ' + info.response);
                    task.stop()
                }
            });
        }, {
            scheduled: false,
        })

        task.start()
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, msg: error })
        res.send(error)
    }

    res.status(StatusCodes.OK).json({ success: true })
}

module.exports = {
    scheduleEmail
}