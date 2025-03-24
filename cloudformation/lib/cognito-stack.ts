import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
// import { aws_cognito as cognito } from 'aws-cdk-lib';


export class CognitoStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const userPool = new cognito.UserPool(this, 'XpressbuyUserPool', {
            userPoolName: 'xpressbuy',
            selfSignUpEnabled: true,
            // cognito user pool sign in options: email
            signInAliases: {
                email: true,
            },
            // This property specifies which attributes Cognito will automatically verify upon user sign-up.
            autoVerify: {
                email: true,
            },
            // No mfa is required
            mfa: cognito.Mfa.OFF,
            // password policy
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireDigits: true,
                requireSymbols: true,
                requireUppercase: true,
                // temporary password set by admin will be expired in 7 days
                tempPasswordValidity: cdk.Duration.days(7),
            },
            // user account recovery
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            // additional required attributes
            standardAttributes: {
                preferredUsername: {
                    required: true,
                    mutable: true,
                },
                email: {
                    required: true,
                    mutable: true,
                },
                fullname: {
                    required: true,
                    mutable: true,
                },
            },
            // Send email with cognito 
            userVerification: {
                emailSubject: 'Verify your email for signing up on XpressBuy!',
                emailBody: 'Hello {username}, Thanks for signing up to XpressBuy! Your verification code is {####}',
                emailStyle: cognito.VerificationEmailStyle.CODE,
                smsMessage: 'Hello {username}, Thanks for signing up to XpressBuy! Your verification code is {####}',
            },
            // Keep the original email address active until the new one is verified. This ensures that users 
            // can continue to use their existing email address while the new one is pending verification.
            keepOriginal: {
                email: true,
            },
        });

        
        // Create a user pool client
        const userPoolClient = new cognito.UserPoolClient(this, 'XpressbuyUserPoolClient', {
            userPool,
            userPoolClientName: 'XpressBuy-AuthClient',
            generateSecret: false,
            // authFlows: Specifies the authentication flows that are enabled for the client.
            authFlows: {
                // userPassword: Allows users to sign in using their username and password.
                userPassword: true,
                // userSrp: Allows users to sign in using the Secure Remote Password (SRP) protocol
                userSrp: true,
            },
            accessTokenValidity: cdk.Duration.hours(1),
            idTokenValidity: cdk.Duration.hours(1),
            refreshTokenValidity: cdk.Duration.days(30),
            // preventUserExistenceErrors: When set to true, it prevents Cognito from revealing whether a user exists 
            // or not when an authentication attempt fails, enhancing security by mitigating user enumeration attacks.
            preventUserExistenceErrors: true,
        });



        // Output the user pool id and client id
        new cdk.CfnOutput(this, 'UserPoolId', {
            value: userPool.userPoolId,
        });
        new cdk.CfnOutput(this, 'UserPoolClientId', {
            value: userPoolClient.userPoolClientId,
        });
    }
}