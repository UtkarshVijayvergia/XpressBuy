import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
// import Dashboard from './pages/feed/Dashboard';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Navbar from './components/Navbar';
// import About from './pages/About';
// import Profile from './pages/profile/Profile';
// import LandingPage from './pages/landingPage/LandingPage';
// import Error404 from './pages/Error404';
// import AccountDetails from './pages/profileDetails/AccountDetails';
import LandingPage from './pages/landingPage/LandingPage';
import Login from './pages/login/Login';
import Register from './pages/signUp/Register';
import Home from './pages/homePage/Home';


function App() {
    return (
        <>
           <Router>
                {/* <Navbar/> */}
                    <Routes>
                        <Route path='/' element={<LandingPage/>}/>
                        <Route path='/login' element={<Login/>} />
                        <Route path='/signup' element={<Register/>} />
                        <Route path='/home' element={<Home/>} />
                        {/* <Route path='/contact' element={<About/>} /> */}

                        {/* {user?(<Route path={`user/${user.name}`} element={<Profile/>} />):<></>} */}
                        {/* {user?(<Route path={`user/${user.name}/${user._id}`} element={<AccountDetails/>} />):<></>} */}
                        
                        {/* <Route path='*' exact={true} element={<Error404/>} /> */}

                    </Routes>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
