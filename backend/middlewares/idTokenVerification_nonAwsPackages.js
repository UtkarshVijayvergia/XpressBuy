const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');


// Setup a JWKS client to fetch public keys from Cognito
const jwksClientInstance = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.COGNITO_USER_POOL_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});


// Middleware to verify the ID token
const verifyIdToken = (req, res, next) => {
    // check for the authorization header or the token
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = req.headers.authorization.split(' ')[1];
    
    // verify the JWT signature using the publicKey from the JWKS
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if(err){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Additional checks - iss (issuer: Cognito), aud (audience: app client id), exp (expiry time)
        if(!decoded ||
            !decoded.iss || decoded.iss !== `https://cognito-idp.${process.env.COGNITO_USER_POOL_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}` ||
            !decoded.aud || decoded.aud !== `${process.env.COGNITO_USER_POOL_CLIENT_ID}` ||
            !decoded.exp || Date.now() >= decoded.exp * 1000){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Store the decoded user information in the request object
        req.user = decoded;

        // Move to the next middleware or route handler
        next();
    });
};


// Function to get the public key for verifying the signature
// public key can be identified with the `kid` from the JWT's header
const getKey = (header, callback) => {
    jwksClientInstance.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
};


module.exports = {
    verifyIdToken,
};