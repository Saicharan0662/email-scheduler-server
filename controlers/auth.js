const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

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

    // const token = jwt.sign({ name: user.name, email, password }, process.env.JWT_SECRET, {
    //     expiresIn:
    //         process.env.JWT_LIFETIME
    // })
    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email }, token })
}

module.exports = {
    register,
    activateAccount,
    login
}