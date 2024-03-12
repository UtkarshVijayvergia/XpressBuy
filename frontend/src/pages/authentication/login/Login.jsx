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
    const signOut = async () => {
        try {
            await Auth.signOut();
            navigate(lastPage);
        } catch (err) {
            console.log(err);
        }
    }


    // aws-amplify aws cognito - sign in
    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        // field validation
        if(email === '' || password === ''){
            setErrors('All Fields Are Required')
        }
        else{
            try {
                // Sign in with email and password
                const user = await Auth.signIn(email, password);
                // Send the tokens to the server
                const isTokenValid = await verifyIdToken(user.signInUserSession.idToken.jwtToken, user.signInUserSession.accessToken.jwtToken, user.signInUserSession.refreshToken.token);
                // check if server has verified the ID token
                if(!isTokenValid){
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
            const response = await fetch('http://localhost:5000/api/v1/VerifyIdToken', {
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
                                        <div className=''>
                                            <FaEnvelope className='' />
                                            <input className='login-input-setter' type="email" id='email' name='email' value={email} placeholder='Your Email' onChange={onChange} />
                                        </div>
                                    </div>

                                   <div className="login-input-fields">
                                        <div className=''>
                                            <FaLock className='' />
                                            <input className='login-input-setter' type="password" id='password' name='password' value={password} placeholder='Your Password' onChange={onChange} />
                                        </div>
                                    </div>
                                    {
                                        errors ? <div className='login-errors'>{errors}</div> : <div className='padder4vh'></div>
                                    }
                                    <div className="login-btn">
                                        <button type="submit" className="btn login-btn-decor" onClick={onSubmit} >Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="login-grid-item">
                            <div className="login-grid-item1">
                                <div className='login-signup-navigate-container'>
                                    <Link className="login-signup-navigate" to={`/signup`}> <p> Create A New Account? <b>Sign Up</b></p></Link>
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