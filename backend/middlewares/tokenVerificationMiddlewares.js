const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const { JwtExpiredError } = require("aws-jwt-verify/error");
const { FetchError } = require("aws-jwt-verify/error");


// Verify the ID token from the cookies
const verifyIdTokenMiddleware = async (req, res, next) => {
    if (!req.cookies || !req.cookies.id_token) {
        console.log("No Token, Not authorized");
        return res.status(401).send('No Token, Not authorized')
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

        console.log('ID token verified');
        next();
    } 
    catch (error) {
        if (error instanceof JwtExpiredError) {
            console.log('Token expired');
            return refreshTokens(req, res, next);
        }
        if (error instanceof FetchError) {
            console.log('Latency Error');
            // return res.status(401).send('Latency Error');
            return verifyAccessTokenMiddleware(req, res, next);
        }
        console.log(error);
        return res.status(401).send('Unauthorized');
    }
};




// Verify the access token from the cookies
const verifyAccessTokenMiddleware = async (req, res, next) => {
    if (!req.cookies || !req.cookies.access_token) {
        console.log("No Token, Not authorized");
        return res.status(401).send('No Token, Not authorized')
    }

    const accessToken = req.cookies.access_token;

    // create a verifier instance using the `verify` method from the `aws-jwt-verify` package
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: "access",
        clientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    });
    
    try {
        // verify the JWT signature using the publicKey from the JWKS
        const payload = await verifier.verify(accessToken);

        // Store the payload user information in the request object
        req.user_id = payload['sub'];

        console.log('Access token verified');
        next();
    } 
    catch (error) {
        if (error instanceof JwtExpiredError) {
            console.log('Token expired');
            return refreshTokens(req, res, next);
        }
        if (error instanceof FetchError) {
            console.log('Latency Error');
            // return res.status(401).send('Latency Error');
            return verifyAccessTokenMiddleware(req, res, next);
        }
        console.log(error);
        return res.status(401).send('Unauthorized');
    }
};




// refresh the access token using the refresh token
const refreshTokens = async (req, res, next) => {
    console.log('Refreshing tokens...');
    if (!req.cookies.refresh_token) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    const refreshToken = req.cookies.refresh_token;

    const cognitoIdentity = new CognitoIdentityProviderClient({ 
        region: process.env.COGNITO_USER_POOL_REGION
    });
    const command = new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
        AuthParameters: {
            "REFRESH_TOKEN": refreshToken
        }
    });

    try {
        const response = await cognitoIdentity.send(command);
        // overwrite the old tokens with the new ones
        res.cookie('access_token', response.AuthenticationResult.AccessToken, {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: false, // for now because localhost is on http. If true: The cookie can only be transmitted over https
            sameSite: 'Lax', // The cookie can only be sent to the same site as the one that it's already on
        });
        res.cookie('id_token', response.AuthenticationResult.IdToken, {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: false, // for now because localhost is on http. If true: The cookie can only be transmitted over https
            sameSite: 'Lax', // The cookie can only be sent to the same site as the one that it's already on
        });
        console.log("tokens refreshed");
        next();
    } 
    catch (error) {
        if (error.name === 'NotAuthorizedException') {
          res.status(401).json({ message: 'Refresh token has expired or is invalid. Please re-authenticate.' });
        }
        if (error instanceof FetchError) {
            console.log('Latency Error');
            return res.status(401).send('Latency Error');
        }
        console.log(error);
        return res.status(500).send('Failed to refresh token. Please re-authenticate.');
    }
};



module.exports = {
    verifyIdTokenMiddleware,
    verifyAccessTokenMiddleware,
};