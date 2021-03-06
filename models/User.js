const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const getVerificationEmail = require('../emails/verification');
const getResetPassEmail = require('../emails/resetpassword');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    isActivated: {
        type: Boolean,
        default: false
    }
})

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.comparePassword = async function (clientPassword) {
    const isMatch = await bcrypt.compare(clientPassword, this.password)
    return isMatch
}

UserSchema.methods.sendVerificationEmail = async function (token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASS
        }
    });

    const mailOptions = {
        from: 'saicharana01@gmail.com',
        to: this.email,
        subject: 'Welcome, Please Verify Your Email',
        html: getVerificationEmail(token, this.name)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // console.log(error);
        } else {
            // console.log('Email sent: ' + info.response);
        }
    });
}

UserSchema.methods.sendResetPasswordEmail = async function (token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASS
        }
    });

    const mailOptions = {
        from: 'saicharana01@gmail.com',
        to: this.email,
        subject: 'E-Scheduler Password Reset',
        html: getResetPassEmail(token, this.name)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // console.log(error);
        } else {
            // console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = mongoose.model('User', UserSchema)