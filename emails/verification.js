
const getVerificationEmail = (token, name) => {
    return (
        `
            <h2>Hi ${name}!</h2>
            <h4>We are glad that you joined our family!!</h4>
            <p>Please click the below link to confirm your email and activate your account</p><p>This link will active for only for 20 minutes</p> <a href="http://localhost:3000/confirmation/${token}"}>activate account</a>
            <p>If you did not request for this email, please ignore it.</p>
            </br>
            <p>Thanks</p>
            <p>Owner: <a href="https://www.linkedin.com/in/saicharan0662/">Sai Charan</a></p>
        `
    )
}

module.exports = getVerificationEmail