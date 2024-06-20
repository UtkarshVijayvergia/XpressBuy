import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'

import Navbar from '../../components/navbar/Navbar'
import ErrorPage from '../errorPage/ErrorPage'
import { LastPageContext } from '../../contexts/LastPageContext';


const UserProfile = () => {

    const location = useLocation();
    const { setLastPage } = useContext(LastPageContext);


    const [userProfileInfo, setUserProfileInfo] = useState([]);


    // Get User Profile Info
    const getUserProfileInfo = async () => {
        try {
            const response = await fetch('http://xpressbuy-backend-alb-2126578185.ap-south-1.elb.amazonaws.com:5000/api/v1/user/profile', {
                credentials: 'include',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUserProfileInfo(data);
        } catch (error) {
            console.error("Error fetching user profile info: ", error);
        }
    }


    // useEffect for fetching user profile info
    useEffect(() => {
        getUserProfileInfo();
    }, []); // Empty array ensures this runs only on mount


    // useEffect for setting last page
    useEffect(() => {
        setLastPage(location.pathname);
    }, []); // Empty array ensures this runs only on mount


    return (
        <div>
            <Navbar />
            {
                userProfileInfo.length === 0 ?
                    <ErrorPage />
                    :
                    <div className="categories">
                        <h1>User Profile</h1>
                        <div className="category-list">
                            <div className="category-item">
                                <h2>Email</h2>
                                <p>{userProfileInfo.email}</p>
                            </div>
                            <div className="category-item">
                                <h2>Username</h2>
                                <p>{userProfileInfo.username}</p>
                            </div>
                            <div className="category-item">
                                <h2>Name</h2>
                                <p>{userProfileInfo.name}</p>
                            </div>
                            <div className="category-item">
                                <h2>Email Verified</h2>
                                <p>
                                    {
                                        userProfileInfo.email_verified ? "Yes" : "No"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default UserProfile