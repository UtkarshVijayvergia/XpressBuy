import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { Amplify } from 'aws-amplify';

import 'react-toastify/dist/ReactToastify.css'
import LandingPage from './pages/landingPage/LandingPage';
import Login from './pages/authentication/login/Login';
import ConfirmEmail from './pages/userConfirmation/ConfirmEmail'
import SignUp from './pages/authentication/signUp/SignUp';
import Home from './pages/homePage/Home';
import Categories from './pages/products/Categories';
import Product from './pages/products/Product';
import ErrorPage from './pages/errorPage/ErrorPage';

import { LastPageContext } from './contexts/LastPageContext';


function App() {

    const [lastPage, setLastPage] = useState('/');


    Amplify.configure({
        "AWS_PROJECT_REGION": process.env.REACT_APP_AWS_PROJECT_REGION,
        "aws_cognito_region": process.env.REACT_APP_AWS_COGNITO_REGION,
        "aws_user_pools_id": process.env.REACT_APP_AWS_USER_POOLS_ID,
        "aws_user_pools_web_client_id": process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
        "oauth": {},
        Auth: {
            // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,         // We are not using an Identity Pool
            region: process.env.REACT_APP_AWS_PROJECT_REGION,
            userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
            userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
        }
    });
    // For changing user `Confirmed status` from `Force change password` to `CONFIRMED` in aws cognito
    // aws cognito-idp admin-set-user-password --username <username> --password <password> --user-pool-id <user-pool-id>  --permanent


    return (
        <>
            <LastPageContext.Provider value={{ lastPage, setLastPage }}>
                <Router>
                    <Routes>
                        <Route path='/' element={<LandingPage />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/confirm' element={<ConfirmEmail />} />
                        <Route path='/products/:category_id' element={<Categories />} />
                        <Route path='/products/:category_id/:product_id' element={<Product />} />
                        {/* <Route path='/contact' element={<About/>} /> */}

                        {/* {user?(<Route path={`user/${user.name}`} element={<Profile/>} />):<></>} */}
                        {/* {user?(<Route path={`user/${user.name}/${user._id}`} element={<AccountDetails/>} />):<></>} */}

                        <Route path='*' exact={true} element={<ErrorPage />} />

                    </Routes>
                </Router>
                <ToastContainer />
            </LastPageContext.Provider>
        </>
    );
}

export default App;
