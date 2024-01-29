import React from 'react'
import './landingPage.css'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
        <div>
            <center>
                <h1>
                    LandingPage
                </h1>
                <br />
                <Link to={'/login'}>Login</Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to={'/signup'}>SignUp</Link>
            </center>
        </div>
    )
}

export default LandingPage