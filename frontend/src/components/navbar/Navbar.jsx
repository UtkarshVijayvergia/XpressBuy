import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';
import { Auth } from 'aws-amplify';

import { LastPageContext } from '../../contexts/LastPageContext';
import './navbar.css';

const Navbar = ({ setCategoryName }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lastPage } = React.useContext(LastPageContext);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });


    // function to check if user is authenticated
    const checkUser = async () => {
        try {
            await Auth.currentAuthenticatedUser({ bypassCache: false });
            setIsAuthenticated(true);
            console.log("User is authenticated");
        } catch (err) {
            setIsAuthenticated(false);
            console.log(err);
        }
    };


    // function to open sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    // Navigate back to home page
    const backToHome = () => {
        navigate('/');
    }


    // sign out
    const signOut = async () => {
        try {
            await Auth.signOut();
            setIsAuthenticated(false);
            navigate(lastPage);
        } catch (err) {
            console.log(err);
        }
    };


    // useEffect to check if user is authenticated
    useEffect(() => {
        checkUser();
    }, []);


    // useEffect for window size
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount


    return (
        <div>
            <nav className={location.pathname === '/' ? 'navbar' : 'navbar-cat'}>
                <ul className="navbar-nav">
                    <li className="nav-item-logo">
                        <Link to="/">
                            {
                                windowSize.width > 800 && location.pathname === '/' ?
                                    <img className='navbar-logo-symbol' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Design_NoBg_White.png`)} alt='logo' />
                                    :
                                    <img className='navbar-logo-symbol' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Design_NoBg_Black.png`)} alt='logo' />
                            }
                        </Link>
                    </li>
                    <li className="nav-item-xpressbuy">
                        <Link to="/">
                            {
                                windowSize.width > 800 && location.pathname === '/' ?
                                    <img className='navbar-logo' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Chars_NoBg.png`)} alt='logo' />
                                    :
                                    <img className='navbar-logo' src={require(`../../assets/images/XpressBuy/XpressBuy_Logo_Chars_Black_NoBg.png`)} alt='logo' />
                            }
                        </Link>
                    </li>

                    <div className='nav-item-direction'>
                        <div className='nav-item-left'>
                            {
                                windowSize.width > 800
                                    ? <>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : location.pathname === '/products/018DE5AA-91A7-BD3C-F93C-C1FADA5DC1C4' ? 'nav-item-curr-cat-name' : 'nav-item-cat-name'}
                                                onClick={() => setCategoryName && setCategoryName('018DE5AA-91A7-BD3C-F93C-C1FADA5DC1C4')}
                                                to="/products/018DE5AA-91A7-BD3C-F93C-C1FADA5DC1C4">EVERYTHING</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : location.pathname === '/products/018DE5AC-A4DC-2600-C495-D8E31F87C887' ? 'nav-item-curr-cat-name' : 'nav-item-cat-name'}
                                                onClick={() => setCategoryName && setCategoryName('018DE5AC-A4DC-2600-C495-D8E31F87C887')}
                                                to="/products/018DE5AC-A4DC-2600-C495-D8E31F87C887">MEN</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : location.pathname === '/products/018DE5AC-BAB0-00C1-0248-2816E5309CCF' ? 'nav-item-curr-cat-name' : 'nav-item-cat-name'}
                                                onClick={() => setCategoryName && setCategoryName('018DE5AC-BAB0-00C1-0248-2816E5309CCF')}
                                                to="/products/018DE5AC-BAB0-00C1-0248-2816E5309CCF">WOMEN</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} to="/">SPECIALS</Link>
                                        </li>
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                        <div className='nav-item-right'>
                            {
                                windowSize.width > 1100
                                    ? <>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} to="/">ABOUT</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} to="/">CONTACT US</Link>
                                        </li></>
                                    :
                                    <></>
                            }
                            {
                                isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} to="/"> $0 &nbsp; <FaShoppingCart />&nbsp;</Link>
                                        </li>

                                    </>
                                ) : <>
                                    <li className="nav-item">
                                        <Link className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} to="/login">LOG IN</Link>
                                    </li>
                                    <li className="nav-item nav-last-item">
                                        <Link className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} to="/signup">SIGN UP</Link>
                                    </li>
                                </>
                            }
                            <li className='nav-item '>
                                {
                                    windowSize.width > 800 ?
                                        isAuthenticated ?
                                            <div className="dropdown">
                                                <FaUser className={location.pathname === '/' ? 'nav-item-name' : 'nav-item-cat-name'} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} />
                                                {profileDropdownOpen && (
                                                    <div className="dropdown-content">
                                                        <Link className={location.pathname === '/' ? 'nav-item-name drop-options' : 'nav-item-cat-name drop-options'} to="/profile">PROFILE</Link>
                                                        <Link className={location.pathname === '/' ? 'nav-item-name drop-options' : 'nav-item-cat-name drop-options'} onClick={signOut}>SIGN OUT</Link>
                                                    </div>
                                                )}
                                            </div>
                                            :
                                            <></>
                                        :
                                        <div className="nav-last-item">
                                            <div className='nav-menu' onClick={toggleSidebar}>
                                                <FaBars className='nav-item-name' />
                                            </div>
                                            {isSidebarOpen && (
                                                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                                                    <button className="close-btn" onClick={toggleSidebar}>×</button>
                                                    <div className="sidebar-content">
                                                        <hr />
                                                        {
                                                            isAuthenticated ?
                                                                <>
                                                                    <Link className='nav-item-name' onClick={toggleSidebar} to="/"><FaUser className='nav-sidebar-fauser' /></Link>
                                                                    <hr />
                                                                </>
                                                                :
                                                                <></>
                                                        }
                                                        <div className="nav-sidebar-item">
                                                            <Link className='nav-sidebar-item-name' onClick={() => { setCategoryName ? setCategoryName('018DE5AA-91A7-BD3C-F93C-C1FADA5DC1C4') : backToHome(); toggleSidebar() }}
                                                                to="/products/018DE5AA-91A7-BD3C-F93C-C1FADA5DC1C4">EVERYTHING
                                                            </Link>
                                                        </div>
                                                        <div className="nav-sidebar-item">
                                                            <Link className='nav-sidebar-item-name' onClick={() => { setCategoryName ? setCategoryName('018DE5AC-A4DC-2600-C495-D8E31F87C887') : backToHome(); toggleSidebar() }}
                                                                to="/products/018DE5AC-A4DC-2600-C495-D8E31F87C887">MEN
                                                            </Link>
                                                        </div>
                                                        <div className="nav-sidebar-item">
                                                            <Link className='nav-sidebar-item-name' onClick={() => { setCategoryName ? setCategoryName('018DE5AC-BAB0-00C1-0248-2816E5309CCF') : backToHome(); toggleSidebar() }}
                                                                to="/products/018DE5AC-BAB0-00C1-0248-2816E5309CCF">WOMEN
                                                            </Link>
                                                        </div>
                                                        <div className="nav-sidebar-item">
                                                            <Link className='nav-sidebar-item-name' onClick={() => { setCategoryName ? backToHome() : backToHome(); toggleSidebar() }}
                                                                to="/">SPECIALS
                                                            </Link>
                                                        </div>
                                                        {/* <div className='nav-sidebar-partition'>-</div> */}
                                                        <br /><br />
                                                        <div className="nav-sidebar-item">
                                                            <Link className='nav-sidebar-item-name' onClick={toggleSidebar} to="/">ABOUT</Link>
                                                        </div>
                                                        <div className="nav-sidebar-item">
                                                            <Link className='nav-sidebar-item-name' onClick={toggleSidebar} to="/">CONTACT US</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                }

                            </li>
                        </div>
                    </div>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;