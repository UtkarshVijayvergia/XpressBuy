const express = require('express');
const dotenv = require('dotenv').config();
// const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000;
const app = express()

// Configure cors
const cors = require('cors'); // app.use(cors());
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.29.108:3000'], // replace with your client-side URL
    credentials: true
}));

// configure cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// configure express session
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// verify token route
app.use('/api/v1/tokenVerification', require('./routes/tokenVerificationRoutes'))


// category + products routes
app.use('/api/v1/products', require('./routes/productRoutes'))
app.use('/api/v1/category', require('./routes/categoryRoute'))


// review routes
app.use('/api/v1/reviews', require('./routes/productReviewsRoute'))


// user order routes
app.use('/api/v1/order', require('./routes/orderRoutes'))


// test routes
app.use('/api/v1/testdb', require('./test/dbTest'));
app.use('/api/v1/test_dynamodb', require('./test/dbTest_dynamodb'));
app.use('/api/v1/test_s3', require('./test/s3Test'));


// external api routes
app.use('/external', require('./routes/externalApiRoutes'));


// Test if the server is running
app.use('/api/v1/health-check', require('./routes/healthCheckRoute'));



// app.use(errorHandler)


// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});