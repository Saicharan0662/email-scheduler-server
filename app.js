require('dotenv').config();
require('express-async-errors');
const express = require('express');

const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const authRoute = require('./routes/auth');
const emailRoute = require('./routes/email')

const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
app.set('trust proxy', 1)
app.use(express.json());
app.use(cors())
app.use(helmet())
app.use(xss())

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

