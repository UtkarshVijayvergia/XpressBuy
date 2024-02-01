const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Middleware to verify the ID token
const verifyIdToken = async (req, res, next) => {
    // check for the authorization header or the token
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        console.log("No Token, Not authorized");
        res.status(401)
        throw new Error('No Token, Not authorized')
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log("Token:", token);

    // create a verifier instance using the `verify` method from the `aws-jwt-verify` package
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: "id",
        clientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    });
    console.log("Verifier:", verifier);
    
    try {
        // verify the JWT signature using the publicKey from the JWKS
        const payload = await verifier.verify(token);
        console.log("payload:", payload);

        // Store the payload user information in the request object
        req.user = payload;
        console.log("req.user:", req.user);

        // Move to the next middleware or route handler
        next();
    } catch (err) {
        console.log("JWT not valid!", err);
        res.status(401)
        throw new Error('Unauthorized')
    }
};

module.exports = {
    verifyIdToken,
};