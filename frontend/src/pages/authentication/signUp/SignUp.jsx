import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaUserLock, FaLock } from 'react-icons/fa'

import Navbar from '../../../components/navbar/Navbar'
import './signUp.css'

// AWS Amplify authenication
import { Auth } from 'aws-amplify';


const SignUp = () => {
    const navigate = useNavigate()

    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    // User Credentials
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    })
    const { name, email, username, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }


    // sign up with aws-amplify and aws cognito
    const [errors, setErrors] = React.useState('');
    const [user, setUser] = React.useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        if (name === '' || email === '' || username === '' || password === '' || confirmPassword === '') {
            setErrors('All Fields Are Required')
        }
        else if (password.length < 8) {
            setErrors('Minimum Password length is 8')
        }
        else if (password.search(/[a-z]/) < 0) {
            setErrors('Password must contain lowercase letter')
        }
        else if (password.search(/[A-Z]/) < 0) {
            setErrors('Password must contain uppercase letter')
        }
        else if (password.search(/[!#@^*$%&?"]/) < 0) {
            setErrors('Password must contain special character')
        }
        else if (password.search(/[0-9]/) < 0) {
            setErrors('Password must contain number')
        }
        else if (password.length > 15) {
            setErrors('Maximum Password length is 15')
        }
        else if (password !== confirmPassword) {
            setErrors('Password Do Not Match')
        }
        else {
            try {
                const signUpResponse = await Auth.signUp({
                    username: email,
                    password: password,
                    attributes: {
                        name: name,
                        email: email,
                        preferred_username: username,
                    },
                });
                console.log(signUpResponse);
                setUser(signUpResponse.user);
                navigate(`/confirm?email=${email}`);
            } catch (err) {
                console.log(err);
            }
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
            <Navbar currTab={"signin"} />
            <div className="signup-card-container">
                <div className="card">
                    <div className="grid-container">
                        <div className="grid-item">
                            <div className="grid-item1">
                                <div className='signup-login-navigate-container'>
                                {
                                    windowSize.width > 900 ?
                                            <Link className="signup-login-navigate" to={`/login`}> <p>Already A Registered User? <b>Login</b></p></Link>
                                            :
                                            null
                                            }
                                        </div>
                            </div>
                        </div>
                        <div className="grid-item">
                            <div className="heading">
                                SIGN UP
                            </div>
                            <div className="signup-inputs">
                                <form>
                                    <div className="signup-input-fields">
                                        <div className=''>
                                            <FaUser className='' />
                                            <input className='signup-input-setter' type="text" id='name' name='name' value={name} placeholder='Your Name' onChange={onChange} />
                                        </div>
                                    </div>

                                    <div className="signup-input-fields">
                                        <div className=''>
                                            <FaEnvelope className='' />
                                            <input className='signup-input-setter' type="email" id='email' name='email' value={email} placeholder='Your Email' onChange={onChange} />
                                        </div>
                                    </div>

                                    <div className="signup-input-fields">
                                        <div className=''>
                                            <FaUser className='' />
                                            <input className='signup-input-setter' type="text" id='username' name='username' value={username} placeholder='Your Username' onChange={onChange} />
                                        </div>
                                    </div>

                                    <div className="signup-input-fields">
                                        <div className=''>
                                            <FaLock className='' />
                                            <input className='signup-input-setter' type="password" id='password' name='password' value={password} placeholder='Your Password' onChange={onChange} />
                                        </div>
                                    </div>
                                    <div className="signup-input-fields">
                                        <div className=''>
                                            <FaUserLock className='' />
                                            <input className='signup-input-setter' type="password" id='confirmPassword' name='confirmPassword' value={confirmPassword} placeholder='Confirm Password' onChange={onChange} />
                                        </div>
                                    </div>
                                    {
                                        errors ? <div className='signup-errors'>{errors}</div> : <div className='padder2vh'></div>
                                    }
                                    <div className="signup-btn">
                                        <button type="submit" className="btn signup-btn-decor" onClick={onSubmit} >Submit</button>
                                    </div>
                                </form>
                                {
                                    windowSize.width <= 900 ?
                                            <Link className="signup-login-navigate" to={`/login`}> <p>Already A Registered User? <b>Login</b></p></Link>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp