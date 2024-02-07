import React, { useEffect } from 'react'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { Auth } from 'aws-amplify'
import './navbar.css'


const Navbar = () => {
    // const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // function to check if user is authenticated
    const checkUser = async () => {
        try {
            await Auth.currentAuthenticatedUser({ bypassCache: false });
            setIsAuthenticated(true);
            console.log("User is authenticated");
            // setUser({
            //     email: user.attributes.email,
            //     name: user.attributes.name,
            //     username: user.attributes.preferred_username,
            // });
        } catch (err) {
            setIsAuthenticated(false);
            console.log(err);
        }
    }

    // useEffect to check if user is authenticated
    useEffect(() => {
        // checkUser();
    }, []);


    return (
        <div>
            <nav className="navbar">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a href="/">
                            <img className='navbar-logo' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Chars_NoBg.png`)} alt='logo' />
                        </a>
                    </li>
                    <div className='nav-item-direction'>
                        <div className='nav-item-left'>
                            <li className="nav-item">
                                <a href="/">Everything</a>
                            </li>
                            <li className="nav-item">
                                <a href="/">MEN</a>
                            </li>
                            <li className="nav-item">
                                <a href="/">WOMEN</a>
                            </li>
                            <li className="nav-item">
                                <a href="/">SPECIALS</a>
                            </li>
                        </div>
                        <div className='nav-item-right'>
                            <li className="nav-item">
                                <a href="/">ABOUT</a>
                            </li>
                            <li className="nav-item">
                                <a href="/">CONTACT US</a>
                            </li>
                            {
                                isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <a href="/"><FaShoppingCart /></a>
                                        </li>
                                    </>
                                ) : <>
                                    <li className="nav-item nav-last-item">
                                        <a href="/sign-in">SIGN IN</a>
                                    </li>
                                </>
                            }
                        </div>
                    </div>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar