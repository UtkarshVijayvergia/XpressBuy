import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import { toast } from 'react-toastify'
import { FaLock, FaEnvelope } from 'react-icons/fa'
import './login.css'

// AWS Amplify authenication
import { Auth } from 'aws-amplify';


const Login = () => {
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const { email, password } = formData;

    // sign in with aws-amplify and aws cognito
    const [errors, setErrors] = React.useState('');
    

    // useEffect(() => {
    //     if(isError){
    //       toast.error(message)
    //     }
    //     if(isSuccess || user){
    //       navigate('/home')
    //     }
    //     dispatch(reset())
    // }, [user, isError, isSuccess, message, navigate, dispatch])


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }


    // const onSubmit = (e) => {
    //     e.preventDefault();
    //     // const userData = {
    //     //     username,
    //     //     password,
    //     // }
    //     // dispatch(login(userData))
    //     console.log(username, password);
    // }
    

    // aws-amplify aws cognito - sign in
    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors('');
        try {
            console.log(email, password);
            const user = await Auth.signIn(email, password);
            console.log(user);
            localStorage.setItem("access_token", user.signInUserSession.accessToken.jwtToken);
            console.log(localStorage.getItem("access_token"));
            window.location.href = "/"
        } catch (error) {
            if (error.code === 'UserNotConfirmedException') {
                window.location.href = "/confirm";
            }
            setErrors(error.message);
            console.log('error signing in', error);
        }
        return false;
    }


    return (
        <div>
            <div className='setPage div-center'>
                <div className='card login-card'>
                    <div className='row'>
                        <div className="col">
                            <div className='img-login'>
                                <img src={require(`../../assets/images/login.jpg`)} height="150px" alt="ShareConnect" />
                            </div>
                            <div className='toRegister'>
                                <b><Link className="no-decoration" aria-current="page" to={`/signup`}>Create an Account</Link></b>
                            </div>
                        </div>
                        <div className="col">
                            <div className='rightCol'>
                                <div className='card-heading'>
                                    <h4><b>Login</b></h4>
                                </div>
                                <form onSubmit={onSubmit}>
                                    <div className="form-group formPadder">
                                        <div className='inputTaker form-control'>
                                            <FaEnvelope className='faFig' />
                                            <input type="email" id='email' name='email' value={email} placeholder='Email' onChange={onChange} />
                                        </div>
                                    </div>
                                    <div className="form-group formPadder">
                                        <div className='inputTaker form-control'>
                                            <FaLock className='faFig' />
                                            <input type="password" id='password' name='password' value={password} placeholder='Your Password' onChange={onChange} />
                                        </div>
                                    </div>
                                    <div className="form-group submitForm">
                                        <button type="submit" className="btn btn-block">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login