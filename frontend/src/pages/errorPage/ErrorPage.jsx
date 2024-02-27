import React from 'react'
import './errorPage.css'


const ErrorPage = () => {
    return (
        <div className='error-body'>
            <h1 className='error-header'>Error 404</h1>
            <p className='error-subHeader'>Sorry, the page you were looking for could not be found.</p>
        </div>
    )
}

export default ErrorPage