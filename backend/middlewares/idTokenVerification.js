const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Middleware to verify the ID token
const verifyIdToken = async (req, res, next) => {
    // check for the authorization header or the token
    if (!req.cookies || !req.cookies.id_token) {
        console.log("No Token, Not authorized");
        res.status(401)
        throw new Error('No Token, Not authorized')
    }
    const idToken = req.cookies.id_token;

    // create a verifier instance using the `verify` method from the `aws-jwt-verify` package
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: "id",
        clientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    });
    
    try {
        // verify the JWT signature using the publicKey from the JWKS
        const payload = await verifier.verify(idToken);

        // Store the payload user information in the request object
        req.user_details = payload;

        // Move to the next middleware or route handler
        next();
    } 
    catch (err) {
        console.log("JWT not valid!", err);
        if (err.message === 'JwtExpiredError') {
            res.status(401).send('Token Expired');
        }
        else if (err.message === 'FetchError') {
            res.status(401).send('Latency Error');
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
};

module.exports = {
    verifyIdToken,
};