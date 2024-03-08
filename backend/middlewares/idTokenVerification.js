const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Middleware to verify the ID token
const verifyIdToken = async (req, res, next) => {
    // check for the authorization header or the token
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        console.log("No Token, Not authorized");
        res.status(401)
        throw new Error('No Token, Not authorized')
    }
    const idToken = req.headers.authorization.split(' ')[1];

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
        req.user = payload;

        // After verifying the ID token
        res.cookie('id_token', idToken, {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: false, // for now because localhost is on http. If true: The cookie can only be transmitted over https
            sameSite: 'strict' // The cookie can only be sent to the same site as the one that it's already on
        });
        
        const accessToken = req.headers['x-access-token'];
        res.cookie('access_token', accessToken, {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: false, // for now because localhost is on http. If true: The cookie can only be transmitted over https
            sameSite: 'strict' // The cookie can only be sent to the same site as the one that it's already on
        });


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