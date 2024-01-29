import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { login, reset } from '../../features/auth/authSlice'
import { Link } from 'react-router-dom'
// import { toast } from 'react-toastify'
import { FaLock, FaEnvelope } from 'react-icons/fa'
// import Spinner from '../../components/Spinner'
import './login.css'


const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const { username, password } = formData;

    const navigate = useNavigate()

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
        setFormData( (prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault();

        // const userData = {
        //     username,
        //     password,
        // }

        // dispatch(login(userData))
        console.log(username, password);
    }


    // if(isLoading){
    //     return <Spinner />
    // }


    return (
        <div>
            <div className='setPage div-center'>
                <div className='card login-card'>
                    <div className='row'>
                        <div className="col">
                            <div className='img-login'>
                                <img src={require(`../../assets/images/login.jpg`)} height="150px" alt="ShareConnect"/>
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
                                            <FaEnvelope className='faFig'/>
                                            <input type="username" id='username' name='username' value={username} placeholder='Username' onChange={onChange}/>
                                        </div>
                                    </div>
                                    <div className="form-group formPadder">
                                        <div className='inputTaker form-control'>
                                            <FaLock className='faFig'/>
                                            <input type="password" id='password' name='password' value={password} placeholder='Your Password' onChange={onChange}/>
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