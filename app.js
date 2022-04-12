require('dotenv').config();
require('express-async-errors');
const express = require('express');

const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit');
const authRoute = require('./routes/auth');
const emailRoute = require('./routes/email')

const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

// security packages
app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, //15 min
    max: 150 // limit each IP to 100 requests per windowMs
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// app.use('/api/v1/', (req, res) => {
//     res.send("Hello beautiful people")
// })

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/email', emailRoute);

app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () =>
            console.log(`app is listening to port ${PORT}...`)
        )
    } catch (error) {
        console.log(error);
    }
}

start()

