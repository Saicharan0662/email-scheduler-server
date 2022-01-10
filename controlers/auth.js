const User = require('../models/User');

const register = async (req, res) => {
    res.send('register controler')
}

const activateAccount = async (req, res) => {
    res.send('activate account controler')
}

const login = async (req, res) => {
    res.send('login controler')
}

module.exports = {
    register,
    activateAccount,
    login
}