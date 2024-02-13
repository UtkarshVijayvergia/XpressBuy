import React, { useEffect } from 'react'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { Auth } from 'aws-amplify'
import './navbar.css'


const Navbar = (props) => {
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
                    <li className="nav-item-logo">
                        <a href="/">
                            <img className='navbar-logo-symbol' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Design_NoBg_White.png`)} alt='logo' />
                        </a>
                    </li>
                    <li className="nav-item-xpressbuy">
                        <a href="/">
                            <img className='navbar-logo' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Chars_NoBg.png`)} alt='logo' />
                        </a>
                    </li>
                    <div className='nav-item-direction'>
                        <div className='nav-item-left'>
                            <li className="nav-item">
                                <a className='nav-item-name' href="/">EVERYTHING</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-item-name' href="/">MEN</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-item-name' href="/">WOMEN</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-item-name' href="/">SPECIALS</a>
                            </li>
                        </div>
                        <div className='nav-item-right'>
                            <li className="nav-item">
                                <a className='nav-item-name' href="/">ABOUT</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-item-name' href="/">CONTACT US</a>
                            </li>
                            {
                                isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <a className='nav-item-name' href="/"><FaShoppingCart /></a>
                                        </li>
                                    </>
                                ) : <>
                                    <li className="nav-item nav-last-item">
                                        <a className='nav-item-name' href="/signup">SIGN IN</a>
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