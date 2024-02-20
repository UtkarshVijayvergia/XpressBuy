import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'
import { Auth } from 'aws-amplify'
import './navbar.css'


const Navbar = (props) => {
    // const [user, setUser] = useState(null);
    const location = useLocation();
    
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
        checkUser();
    }, []);
    // XpressBuy_Logo_Chars_Black_NoBg

    return (
        <div>
            <nav className={ location.pathname=='/' ? 'navbar' : 'navbar-cat' }>
                <ul className="navbar-nav">
                    <li className="nav-item-logo">
                        <a href="/">
                            {
                                location.pathname=='/' ?
                                <img className='navbar-logo-symbol' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Design_NoBg_White.png`)} alt='logo' />
                                :
                                <img className='navbar-logo-symbol' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Design_NoBg_Black.png`)} alt='logo' />
                            }
                        </a>
                    </li>
                    <li className="nav-item-xpressbuy">
                        <a href="/">
                            {
                                location.pathname=='/' ?
                                <img className='navbar-logo' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Chars_NoBg.png`)} alt='logo' />
                                :
                                <img className='navbar-logo' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Chars_Black_NoBg.png`)} alt='logo' />
                            }
                        </a>
                    </li>
                    <div className='nav-item-direction'>
                        <div className='nav-item-left'>
                            <li className="nav-item">
                                <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/">EVERYTHING</a>
                            </li>
                            <li className="nav-item">
                                <a className={ location.pathname=='/' ? 'nav-item-name' : location.pathname=='/men' ? 'nav-item-curr-cat-name' : 'nav-item-cat-name' } href="/men">MEN</a>
                            </li>
                            <li className="nav-item">
                                <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/">WOMEN</a>
                            </li>
                            <li className="nav-item">
                                <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/">SPECIALS</a>
                            </li>
                        </div>
                        <div className='nav-item-right'>
                            <li className="nav-item">
                                <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/">ABOUT</a>
                            </li>
                            <li className="nav-item">
                                <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/">CONTACT US</a>
                            </li>
                            {
                                isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/"> $0 <FaShoppingCart /></a>
                                        </li>
                                    </>
                                ) : <>
                                    <li className="nav-item nav-last-item">
                                        <a className={ location.pathname=='/' ? 'nav-item-name' : 'nav-item-cat-name' } href="/signup">SIGN IN</a>
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