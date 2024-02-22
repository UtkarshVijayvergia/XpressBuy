const express = require('express');
const dotenv = require('dotenv').config();
// const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000;
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

app.use('/api/v1/testdb', require('./test/dbTest'));
app.use('/api/v1/test_dynamodb', require('./test/dbTest_dynamodb'));

// app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});