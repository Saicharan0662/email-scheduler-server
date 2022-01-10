require('dotenv').config();
require('express-async-errors');
const express = require('express');

const connectDB = require('./db/connect')
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoute);

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

