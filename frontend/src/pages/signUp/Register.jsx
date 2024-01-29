import React from 'react'
import { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import { register, reset } from '../../features/auth/authSlice'
import { FaUser, FaEnvelope, FaUserLock, FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'
// import Spinner from '../../components/Spinner'
import './register.css'

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    })

    const { name, email, username, password, confirmPassword } = formData;

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    // const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    // useEffect(() => {
    //   if(isError){
    //     toast.error(message)
    //   }

    //   if(isSuccess || user){
    //     navigate('/home')
    //   }

    //   dispatch(reset())
    
    // }, [user, isError, isSuccess, message, navigate, dispatch])
    

    const onChange = (e) => {
        setFormData( (prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault();

        // Password Validation
        // if(password.length < 8){
        //     toast.error('Password length must be atleast 8 characters')
        // }
        // else if(password.search(/[a-z]/) < 0) {
        //     toast.error("Password must contain at least one lowercase letter"); 
        // }
        // else if(password.search(/[A-Z]/) < 0) {
        //     toast.error("Password must contain at least one uppercase letter"); 
        // }
        // else if(password.search(/[!#@^*$%&?"]/) < 0) {
        //     toast.error("Password must contain at least one special character"); 
        // }
        // else if(password.search(/[0-9]/) < 0) {
        //     toast.error("Password must contain at least one number"); 
        // }
        // else if(password.length > 15){
        //     toast.error('Password length must not exceed 15 characters')
        // }
        // else if(password !== confirmPassword){
        //     toast.error('Password Do Not Match')
        // }
        
        // else{
        //     const userData = {
        //         name,
        //         email,
        //         password,
        //     }

        //     dispatch(register(userData))
        // }

        console.log(name, email, username, password, confirmPassword);
    }

    // if(isLoading){
    //     return <Spinner />
    // }

    return (
        <div>
            <div className='register-setPage register-div-center'>
                <div className='register-card register-card'>
                    <div className='row'>
                        <div className="col">
                            <div className='register-img-login'>
                                <img src={require(`../../assets/images/register.jpg`)} height="275px" alt="ShareConnect"/>
                            </div>
                            <div className='toLogin'>
                                <p>Already A Registered User? <b><Link to={`/login`}>Login</Link></b></p>
                            </div>
                        </div>
                        <div className="col">
                            <div className='register-rightCol'>
                                <div className='register-card-heading'>
                                    <h4><b>Sign Up</b></h4>
                                </div>
                                <div>
                                    <form onSubmit={onSubmit}>
                                        <div className="form-group register-formPadder">
                                            <div className='register-inputTaker form-control'>
                                                <FaUser className='register-faFig'/>
                                                <input type="text" id='name' name='name' value={name} placeholder='Your Name' onChange={onChange}/>
                                            </div>
                                        </div>

                                        <div className="form-group register-formPadder">
                                            <div className='register-inputTaker form-control'>
                                                <FaEnvelope className='register-faFig'/>
                                                <input type="email" id='email' name='email' value={email} placeholder='Your Email' onChange={onChange}/>
                                            </div>
                                        </div>

                                        <div className="form-group register-formPadder">
                                            <div className='register-inputTaker form-control'>
                                                <FaUser className='register-faFig'/>
                                                <input type="text" id='username' name='username' value={username} placeholder='Your Username' onChange={onChange}/>
                                            </div>
                                        </div>

                                        <div className="form-group register-formPadder">
                                            <div className='register-inputTaker form-control'>
                                                <FaLock className='register-faFig'/>
                                                <input type="password" id='password' name='password' value={password} placeholder='Your Password' onChange={onChange}/>
                                            </div>
                                        </div>
                                        <div className="form-group register-formPadder">
                                            <div className='register-inputTaker form-control'>
                                                <FaUserLock className='register-faFig'/>
                                                <input type="password" id='confirmPassword' name='confirmPassword' value={confirmPassword} placeholder='Confirm Password' onChange={onChange}/>
                                            </div>
                                        </div>
                                        <div className="form-group register-submitForm">
                                            <button type="submit" className="btn btn-block">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register