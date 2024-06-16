import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { FaUser, FaEnvelope, FaUserLock, FaLock } from 'react-icons/fa'

import Navbar from '../../../components/navbar/Navbar'
import './signUp.css'
import { LastPageContext } from '../../../contexts/LastPageContext';

// AWS Amplify authenication
import { Auth } from 'aws-amplify';


const SignUp = () => {
    const navigate = useNavigate()
    const { lastPage } = useContext(LastPageContext);


    // UseState Hooks - aws Amplify aws cognito
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState('');
    const [success, setSuccess] = useState('');
    // UseState Hooks - SignUp
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    })
    // UseState Hooks - OTP Verification
    const [OTPverificationStep, setOTPverificationStep] = useState(false)
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    // UseState Hooks - Window Size
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    

    // User Credentials
    const { name, email, username, password, confirmPassword } = formData;


    // Update the state on sign up input change (name, email, username, password, confirmPassword)
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }


    // OTP Code Input Change Handler
    const code_onchange = (e) => {
        setCode(e.target.value);
    }


    // sign up with aws-amplify and aws cognito and proceed to OTP Verification
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
                setOTPverificationStep(true);
                // navigate(`/confirm?email=${email}`);
            } catch (err) {
                console.log(err);
                setErrors(err.message);
            }
        }
    }


    // verify the ID token
    const verifyIdToken = async (idToken, access_token, refresh_token) => {
        try {
            await fetch('http://xpressbuy-backend-alb-2126578185.ap-south-1.elb.amazonaws.com:5000/api/v1/tokenVerification/verifyIdToken/new-user', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                    'X-Access-Token': `${access_token}`,
                    'X-Refresh-Token': `${refresh_token}`
                },
                body: JSON.stringify({
                    name: name,
                    email_id: email,
                    user_name: username,
                    address: "",
                    created_at: new Date().toISOString()
                }),
            });
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }


    // aws-amplify aws cognito - log in
    const userLogin = async (e) => {
        e.preventDefault();
        setErrors('');
        // field validation
        if (formData.email === '' || formData.password === '') {
            navigate('/login');
        }
        else {
            try {
                const user = await Auth.signIn(email, password);
                // Send the tokens to the server
                const isTokenValid = await verifyIdToken(user.signInUserSession.idToken.jwtToken, user.signInUserSession.accessToken.jwtToken, user.signInUserSession.refreshToken.token);
                // check if server has verified the ID token
                if (!isTokenValid) {
                    setErrors('Invalid ID token');
                    signOut();
                    navigate('/login');
                    return false;
                }
                navigate(lastPage);
            } catch (error) {
                if (error.code === 'UserNotConfirmedException') {
                    navigate('/confirm');
                }
                else{
                    navigate('/login');
                }
            }
        }
    }


    // Resend Activation Code
    const resendCode = async (e) => {
        e.preventDefault();
        setErrors('');
        try {
            console.log(formData.email);
            const resendOtpResponse = await Auth.resendSignUp(formData.email);
            console.log(resendOtpResponse);
            setCodeSent(true);
            // toast.success('Code resent successfully!');
            setSuccess('Code resent successfully!');
        } catch (err) {
            console.log(err);
            setErrors(err.message);
            if (err.message === 'Username cannot be empty') {
                setErrors("You need to provide an email in order to send Resend Activiation Code")
            }
            else if (err.message === "Username/client id combination not found.") {
                setErrors("Email is invalid or cannot be found.")
            }
        }
    }


    // aws-amplify aws cognito - confirm sign up
    const otpConfirmation = async (e) => {
        e.preventDefault();
        setErrors('');
        try {
            console.log(formData.email, code);
            const otpVerificationResponse = await Auth.confirmSignUp(formData.email, code);
            console.log(otpVerificationResponse);
            if(otpVerificationResponse !== 'SUCCESS'){
                setErrors('Invalid OTP');
                return;
            }
            toast.success('Code confirmed successfully!');
            // await addUserToDB();
            await userLogin(e);
        } catch (err) {
            console.log(err);
            setErrors(err.message);
            console.log(errors);
        }
    }


    // Check if user is authenticated
    const checkUser = async () => {
        try{
            const response = await fetch('http://xpressbuy-backend-alb-2126578185.ap-south-1.elb.amazonaws.com:5000/api/v1/tokenVerification/verifyAccessToken', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if(data.isAuthenticated){
                // setIsAuthenticated(true);
                return true;
            }
            return false;
        }
        catch(error){
            // setIsAuthenticated(false)
            console.log(error);
            return false;
        }
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


    // useEffect for navigating to last page if user is authenticated
    // TODO: The page is not navigating to the last page instead it is navigating to the home page
    useEffect(() => {
        const checkUserAuthentication = async () => {
            if (await checkUser()) {
                navigate(lastPage);
            }
        }
        checkUserAuthentication();
    }, []); // Empty array ensures this runs only on mount


    // useEffect for success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer); // This will clear the timer when the component unmounts
        }
    }, [success]);


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
                            {
                                OTPverificationStep ?
                                    <div>
                                        <div className="heading">
                                            OTP Verification
                                        </div>
                                        <div className="signup-inputs">
                                            <form>
                                                <div className="signup-input-fields">
                                                    <div className=''>
                                                        <FaEnvelope className='' />
                                                        <input className='signup-input-setter readOnly-input' type="text" id='email' name='email' value={formData.email} readOnly={true}/>
                                                    </div>
                                                </div>
                                                <div className="signup-input-fields">
                                                    <div className=''>
                                                        <FaUserLock className='' />
                                                        <input className='signup-input-setter' type="text" id='code' name='code' value={code} placeholder=' Enter OTP' onChange={code_onchange}/>
                                                    </div>
                                                </div>
                                                {
                                                    errors ? <div className='signup-errors'>{errors}</div> : <div className='padder2vh'></div>
                                                }
                                                {
                                                    // if success then show success for only 3 seconds then remove it
                                                    success ? <div className='signup-success'>{success}</div> : <div className='padder2vh'></div>
                                                    
                                                }
                                                <div className="otp-verification-btns">
                                                    <div className="signup-btn">
                                                        <button type="submit" className="btn resend-otp-btn-decor" onClick={resendCode}>Resend Code</button>
                                                    </div>
                                                    <div className="signup-btn">
                                                        <button type="submit" className="btn signup-btn-decor" onClick={otpConfirmation}>Confirm</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    :
                                    <div>
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
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp