
const getResetPassEmail = (token, name) => {
    return (
        `
            <h2>Hi ${name}!</h2>
            <h4>Forget your password, no worries!</h4>
            <p>Please click the below link to reset your password</p><p>This link will active for only for 20 minutes</p> <a href="http://localhost:3000/reset-password/${token}"}>reset password</a>
            </br>
            <p>Thanks</p>
            <p>Owner: <a href="https://www.linkedin.com/in/saicharan0662/">Sai Charan</a></p>
        `
    )
}

module.exports = getResetPassEmail