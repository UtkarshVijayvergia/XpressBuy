import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { FaUser, FaEnvelope, FaUserLock, FaLock } from 'react-icons/fa'

import Navbar from '../../../components/navbar/Navbar'
import { LastPageContext } from '../../../contexts/LastPageContext';
import './login.css'

// AWS Amplify authenication
import { Auth } from 'aws-amplify';


const Login = () => {
    const { lastPage } = useContext(LastPageContext);
    const navigate = useNavigate()
    const [errors, setErrors] = React.useState('');


    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    // login credentials
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    })
    const { email, password } = credentials;


    // Update the state on input change (email, password)
    const onChange = (e) => {
        setCredentials((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }


    // sign out
    // TODO: Add removeCookies function during sign out
    const signOut = async () => {
        try {
            await Auth.signOut();
            navigate(lastPage);
        } catch (err) {
            console.log(err);
        }
    }


    // aws-amplify aws cognito - sign in
    const userLogin = async (e) => {
        e.preventDefault();
        setErrors('');
        // field validation
        if (email === '' || password === '') {
            setErrors('All Fields Are Required')
        }
        else {
            try {
                // Sign in with email and password
                const user = await Auth.signIn(email, password);
                // Send the tokens to the server
                const isTokenValid = await verifyIdToken(user.signInUserSession.idToken.jwtToken, user.signInUserSession.accessToken.jwtToken, user.signInUserSession.refreshToken.token);
                // check if server has verified the ID token
                if (!isTokenValid) {
                    setErrors('Invalid ID token');
                    signOut();
                    return false;
                }
                // navigate('/home')
                navigate(lastPage);
            } catch (error) {
                if (error.code === 'UserNotConfirmedException') {
                    navigate('/confirm')
                }
                setErrors("Incorrect username or password.");
                console.log('error signing in', error);
            }
        }
    }


    // verify the ID token
    const verifyIdToken = async (idToken, access_token, refresh_token) => {
        try {
            await fetch('http://xpressbuy-backend-alb-2126578185.ap-south-1.elb.amazonaws.com:5000/api/v1/tokenVerification/verifyIdToken', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                    'X-Access-Token': `${access_token}`,
                    'X-Refresh-Token': `${refresh_token}`
                },
            });
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }


    // useEffect for window size
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount


    return (
        <div>
            <Navbar currentWindow={"signin"} />
            <div className="login-card-container">
                <div className="card">
                    <div className="login-grid-container">
                        <div className="login-grid-item">
                            <div className="login-heading">
                                LOGIN
                            </div>
                            <div className="login-inputs">
                                <form>
                                    <div className="login-input-fields">
                                        <FaEnvelope />
                                        <input className='login-input-setter' type="email" id='email' name='email' value={email} placeholder='Your Email' onChange={onChange} />
                                    </div>

                                    <div className="login-input-fields">
                                        <FaLock />
                                        <input className='login-input-setter' type="password" id='password' name='password' value={password} placeholder='Your Password' onChange={onChange} />
                                    </div>
                                    {
                                        errors ? <div className='login-errors'>{errors}</div> : <div className='padder4vh'></div>
                                    }
                                    <div className="login-btn">
                                        <button type="submit" className="btn login-btn-decor" onClick={userLogin} >Submit</button>
                                    </div>
                                </form>
                                {
                                    windowSize.width <= 900 ?
                                        <Link className="login-signup-navigate" to={`/signup`}> <p> Create A New Account? <b>Sign Up</b></p></Link> 
                                        : 
                                        null
                                }
                            </div>
                        </div>
                        <div className="login-grid-item">
                                    <div className="login-grid-item1">
                                        <div className='login-signup-navigate-container'>
                                            {
                                                windowSize.width > 900 ?
                                                    <Link className="login-signup-navigate" to={`/signup`}> <p> Create A New Account? <b className='sign-up-line-breaker'>Sign Up</b></p></Link> : null
                                            }
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login