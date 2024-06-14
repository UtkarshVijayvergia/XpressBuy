import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
// import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { LastPageContext } from '../../../contexts/LastPageContext';

// AWS Amplify authenication
import { Auth } from 'aws-amplify';


const ConfirmEmail = () => {
    const { lastPage } = useContext(LastPageContext);
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
            await Auth.confirmSignUp(email, code);
            // await addUserToDB();
            navigate(lastPage);
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


    // TODO: Add user to dynamodb table
    // const addUserToDB = async () => {
    //     try {
    //         const response = await fetch('http://xpressbuy-backend-alb-2126578185.ap-south-1.elb.amazonaws.com:5000/api/v1/user/', {
    //             method: 'POST',
    //             credentials: 'include',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 email: email,
    //             }),
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


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