
const getErrorMail = (name) => {
    return (
        `
            <h2>Hi ${name}!</h2>
            <h4>It looks like the email you schedule, was not able to delivered</h4>
            <p>You may have given the incorret password or some configuration issue from your gmail account</p>
            </br>
            <p>Thanks</p>
            <p>Owner: <a href="https://www.linkedin.com/in/saicharan0662/">Sai Charan</a></p>
        `
    )
}

module.exports = getErrorMail