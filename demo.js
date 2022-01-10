require('dotenv').config()
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');

const app = express();
app.use(express.json())
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SERVER_EMAIL,
        pass: process.env.SERVER_PASS
    }
});

const mailOptions = {
    from: 'saicharana01@gmail.com',
    to: 'sai.charans006@gmail.com',
    subject: 'Got some progress',
    html: `<h3> Good luck bro!!!!</h3>`
};

app.post('/api/v1/email', async (req, res) => {
    const { data } = req.body
    const month = new Date(data).getMonth()
    const date = new Date(data).getDate()
    const hours = new Date(data).getHours()
    const minutes = new Date(data).getMinutes()
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

        await task.start()
    } catch (error) {
        console.log(error)
        res.send(error)
    }
    res.send('queued!!!')
})

// const date = moment('Tue Jan 11 2022 04:14:00 GMT+0530')
// console.log(new Date(date).getMinutes())
// console.log(date.format('MM/DD/YY, h:mm a'))
// console.log(moment(new Date()).format('MM/DD/YY, h:mm a'))

// const diff = new Date(date) - new Date();

// console.log(diff / 3600)

// console.log(date.diff(new Date(), 'hour'))

app.listen(5000, () => console.log(`server is listening to port ${5000}...`))