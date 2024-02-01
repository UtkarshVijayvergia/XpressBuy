const express = require('express');
const dotenv = require('dotenv').config();
// const { errorHandler } = require('./middleware/errorMiddleware')
// const connectDB = require('./config/db')
// connectDB();
const port = process.env.PORT || 5000;
const path = require('path');
const app = express()


// Configure cors
const cors = require('cors');
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // replace with your client-side URL
    credentials: true
}));


const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/VerifyIdToken', require('./routes/VerifiedJWT'))

// app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});