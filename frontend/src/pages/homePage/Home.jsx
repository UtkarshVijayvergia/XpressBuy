import React from 'react'

// aws-amplify authenication
import { Auth } from 'aws-amplify';


const Home = () => {
    // aws-amplify aws cognito - get current user
    const [user, setUser] = React.useState(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    // check if user is authenticated
    const checkUser = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser({
                bypassCache: false  // default is also false
            });
            setIsAuthenticated(true);
            console.log(user);
            setUser({
                email: user.attributes.email,
                name: user.attributes.name,
                username: user.attributes.preferred_username,
            });
        } catch (err) {
            setIsAuthenticated(false);
            console.log(err);
        }
    }

    // sign out
    const signOut = async () => {
        try {
            await Auth.signOut();
            setIsAuthenticated(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    
    // const checkUserAuthenticated = React.useCallback(async () => {
    //     try {
    //         await Auth.currentAuthenticatedUser();
    //         userHasAuthenticated(true);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }, []);

    // React.useEffect(() => {
    //     Auth.currentAuthenticatedUser()
    //         .then(user => setUser(user))
    //         .catch(() => setUser(null));
    // }, []);

    React.useEffect(() => {
        checkUser();
    }, []);

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <h1>Home</h1>
                    <h1>Welcome {user.name}</h1>
                    <h1>Email: {user.email}</h1>
                    <h1>Username: {user.username}</h1>
                </div>
            ) : (
                <div>
                    <h1>Home</h1>
                    <h1>Welcome Guest</h1>
                </div>
            )}

            {/* sign out */}
            <button onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default Home