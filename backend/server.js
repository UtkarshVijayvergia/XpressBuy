const express = require('express');
const dotenv = require('dotenv').config();
// const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000;
const app = express()

// Configure cors
const cors = require('cors'); // app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // replace with your client-side URL
    credentials: true
}));

// configure cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// configure express session
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// verify token route
app.use('/api/v1/VerifyIdToken', require('./routes/VerifiedJWT'))


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


// app.use(errorHandler)


// external api routes
app.get('/external/colour/:colour', async (req, res) => {
    const { colour } = req.params;
    const response = await fetch(`https://colornames.org/search/json/?hex=${colour}`);
    const data = await response.json();
    res.status(200).json(data);
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});