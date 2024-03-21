import React from 'react'
import { useNavigate } from 'react-router-dom'

// aws-amplify authenication
import { Auth } from 'aws-amplify';


const Home = () => {
    const navigate = useNavigate()

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


    
    // Data from backend API
    const [data, setData] = React.useState(null);
    const [isData, setIsData] = React.useState(false);

    const getData = async () => {
        // console.log("accessToken", localStorage.getItem("access_token"));
        // try{
        //     const response = await fetch('http://localhost:5000/api/v1/VerifiedJWT', {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //             'Content-Type': 'application/json',
        //         },
        //         Method: 'GET',
        //     });
        //     setData(await response.json());
        //     setIsData(true);
        // }
        // catch(err){
        //     console.log(err);
        // }
        try {
            const response = await fetch('http://localhost:5000/api/v1/testdb', {
                headers: {
                    'Content-Type': 'application/json',
                },
                Method: 'GET',
            });
            const data = await response.json();
            console.log(data);
            setData(data);
            setIsData(true);
        }
        // setIsData(true);
        // setData({data: "data"});
        catch (err) {
            console.log(err);
        }
    }


    // sign out
    const signOut = async () => {
        try {
            await Auth.signOut();
            setIsAuthenticated(false);
            console.log("signed out");
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    }
    

    React.useEffect(() => {
        checkUser();
        // getData();
    }, []);

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <h1>Home</h1>
                    <h1>Welcome {user.name}</h1>
                    <h1>Email: {user.email}</h1>
                    <h1>Username: {user.username}</h1>
                    {/* <h1>Data: {data.data}</h1> */}
                </div>
            ) : (
                <div>
                    <h1>Home</h1>
                    <h1>Welcome Guest</h1>
                </div>
            )}
            {!isData ? (
                <div>
                    <h1>Access Denied</h1>
                </div>
            ) : (
                <>
                </>
            )}
            <br />
            <div>
                {
                    data && data.map((item, index) => {
                        return (
                            <div key={index}>
                                <h5>{item.uuid}</h5>
                                <h5>{item.display_name}</h5>
                                <h5>{item.handle}</h5>
                                <h5>{item.cognito_user_id}</h5>
                                <h5>{item.created_at}</h5>
                                <br /><br />
                            </div>
                        )
                    })
                }
                {/* <h1>{data.uuid}</h1>
                <h1>{data.display_name}</h1>
                <h1>{data.handle}</h1>
                <h1>{data.cognito_user_id}</h1>
                <h1>{data.created_at}</h1> */}
            </div>
            <br />

            {/* sign out */}
            <button onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default Home