import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaUserLock, FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'

// AWS Amplify authenication
import { Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';


const ConfirmEmail = () => {
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    // const params = useParams();

    const code_onchange = (event) => {
        setCode(event.target.value);
    }
    const email_onchange = (event) => {
        setEmail(event.target.value);
    }


    // aws-amplify aws cognito - confirm sign up
    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        try {
            console.log(email, code);
            const confirmSignUpResponse = await Auth.confirmSignUp(email, code);
            console.log(confirmSignUpResponse);
            navigate('/home');
            toast.success('Code confirmed successfully!');
        } catch (err) {
            console.log(err);
            setErrors(err.message);
            console.log(errors);
        }
    }


    // aws-amplify aws cognito - resend sign up code
    const resendCode = async (e) => {
        setErrors('');
        try {
            console.log(email);
            const resendSignUpResponse = await Auth.resendSignUp(email);
            console.log(resendSignUpResponse);
            setCodeSent(true);
            toast.success('Code resent successfully!');
        } catch (err) {
            console.log(err);
            setErrors(err.message);
            if (err.message === 'Username cannot be empty'){
                setErrors("You need to provide an email in order to send Resend Activiation Code")   
            } 
            else if (err.message === "Username/client id combination not found."){
                setErrors("Email is invalid or cannot be found.")   
            }
        }
    }


    return (
        <div>
            <h1>Confirm Email</h1>
            <form>
                <div className="form-group register-formPadder">
                    <div className='register-inputTaker form-control'>
                        <FaEnvelope className='register-faFig'/>
                        <input type="text" id='email' name='email' value={email} placeholder='Your Email' onChange={email_onchange}/>
                    </div>
                </div>
                <div className="form-group register-formPadder">
                    <div className='register-inputTaker form-control'>
                        <FaUser className='register-faFig'/>
                        <input type="text" id='code' name='code' value={code} placeholder='Verification Code' onChange={code_onchange}/>
                    </div>
                </div>
                <div className="form-group register-formPadder">
                    <button type='button' className="btn btn-primary" onClick={resendCode}>Resend Code</button>
                </div>
                <div className="form-group register-formPadder">
                    <button type="submit" className="btn btn-primary" onClick={onSubmit}>Confirm</button>
                </div>
            </form>
        </div>
    )
}

export default ConfirmEmail