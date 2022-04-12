const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    const { name, email, password } = req.body
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, { expiresIn: '20m' })
    const user = await User.create({ name, email, password })
    user.sendVerificationEmail(token)
    res.status(StatusCodes.ACCEPTED).json({ user: { name: user.name, email: user.email }, msg: 'Please confirm your email' })
}

const activateAccount = async (req, res) => {
    const { clientToken } = req.body
    let user;
    try {
        const payload = jwt.verify(clientToken, process.env.JWT_SECRET)
        user = await User.findOneAndUpdate({ email: payload.email }, { isActivated: true }, {
            new: true,
            runValidators: true
        })
    } catch (err) {
        throw new UnauthenticatedError(`Not authorized`)
    }
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email }, clientToken })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        throw new BadRequestError(`Please provide email and password`)

    const user = await User.findOne({ email })
    if (!user)
        throw new UnauthenticatedError('Invalid credentials')

    const token = jwt.sign({ name: user.name, email, password }, process.env.JWT_SECRET, {
        expiresIn:
            process.env.JWT_LIFETIME
    })

    if (!user.isActivated) {
        user.sendVerificationEmail(token)
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Please verify your email, verification link sent to the email ${user.email}` })
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid credentials')

    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token })
}

const resetPasswordEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user)
        throw new UnauthenticatedError('Invalid credentials')
    const token = jwt.sign({ name: user.name, email }, process.env.JWT_SECRET, {
        expiresIn:
            '20m'
    })
    await user.sendResetPasswordEmail(token)
    res.status(StatusCodes.OK).json({ msg: `Reset password link sent to ${email}` })
}

const resetPassword = async (req, res) => {
    const { newPassword, clientToken } = req.body
    let user, hashedPassword;
    try {
        const payload = jwt.verify(clientToken, process.env.JWT_SECRET)
        const salt = await bcrypt.genSalt(10)
        hashedPassword = await bcrypt.hash(newPassword, salt)
        user = await User.findOneAndUpdate({ email: payload.email }, { password: hashedPassword }, {
            new: true,
            runValidators: true
        })
    } catch (error) {
        console.log(error)
        throw new UnauthenticatedError(`Not authorized`)
    }
    const token = jwt.sign({ name: user.name, email: user.email, password: hashedPassword }, process.env.JWT_SECRET, {
        expiresIn:
            process.env.JWT_LIFETIME
    })
    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token })
}

const googleSignup = async (req, res) => {
    const { id_token } = req.body
    client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID }).then(async response => {
        const { email_verified, email, name } = response.payload
        if (email_verified) {
            try {
                const userInDB = await User.findOne({ email })
                if (userInDB) {
                    res.status(StatusCodes.BAD_REQUEST).json({ msg: `Account with email ${email} already exists` })
                }
                const password = email + process.env.JWT_SECRET
                const user = await User.create({ email, name, password, isActivated: true })
                const token = jwt.sign({ name: user.name, email, password }, process.env.JWT_SECRET, {
                    expiresIn:
                        process.env.JWT_LIFETIME
                })
                res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email }, token })
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong' })
            }

        }
    })
}

const googleLogin = async (req, res) => {
    const { id_token } = req.body
    client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID }).then(async response => {
        const { email_verified, email, name } = response.payload
        if (email_verified) {
            try {
                const user = await User.findOne({ email })
                if (!user) {
                    res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Account with email ${email} does not exist` })
                }
                const password = email + process.env.JWT_SECRET
                const token = jwt.sign({ name: user.name, email, password }, process.env.JWT_SECRET, {
                    expiresIn:
                        process.env.JWT_LIFETIME
                })

                res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token })

            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong' })
            }
        }
    })
}

module.exports = {
    register,
    activateAccount,
    login,
    resetPasswordEmail,
    resetPassword,
    googleSignup,
    googleLogin
}