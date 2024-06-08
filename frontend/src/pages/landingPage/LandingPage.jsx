import React from 'react'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { FaTshirt, FaCreditCard, FaCcMastercard, FaShoppingCart, FaIdBadge, FaUserTie, FaVest } from 'react-icons/fa'

import Navbar from '../../components/navbar/Navbar'
import { LastPageContext } from '../../contexts/LastPageContext'
import landingPageImage from '../../assets/images/landingPage/landingPage.png';
import DemoImage from '../../assets/images/landingPage/trialProductBg.png';
import './landingPage.css'


const LandingPage = () => {

    const location = useLocation();
    const { setLastPage } = useContext(LastPageContext);

    const [specialsImages, setSpecialsImages] = useState([]);


    const brandNames = [
        { icon: <FaUserTie />, text: 'VOUIS LUITTON' },
        { icon: <FaTshirt />, text: 'ADIBAS' },
        { icon: <FaCcMastercard />, text: 'REEBOSS' },
        { icon: <FaIdBadge />, text: 'GALENCIABA' },
        { icon: <FaCreditCard />, text: 'GUKKI' },
        { icon: <FaVest />, text: 'PERSACE' },
        { icon: <FaShoppingCart />, text: 'PIKE' },
        { icon: <FaUserTie />, text: 'VOUIS LUITTON' },
        { icon: <FaTshirt />, text: 'ADIBAS' },
        { icon: <FaCcMastercard />, text: 'REEBOSS' },
        { icon: <FaIdBadge />, text: 'GALENCIABA' },
        { icon: <FaCreditCard />, text: 'GUKKI' },
        { icon: <FaVest />, text: 'PERSACE' },
        { icon: <FaShoppingCart />, text: 'PIKE' },
    ];


    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(14, calc(auto))`,
        animation: 'scroll 20s linear infinite',
        gridGap: '20px',
    };


    const MonthOffers = [
        "Frosty January",
        "Chilly February",
        "Fresh March",
        "Verdant April",
        "Sunny May",
        "Hot June",
        "Scorching July",
        "Humid August",
        "Serene September",
        "Spooky October",
        "Chilly November",
        "Festive December",
    ];


    // Get specials images
    const getProducts = async (imageCategory) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/image/landingPageImage/${imageCategory}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (!response.ok) {
                console.error(`Server responded with status code ${response.status}`);
                return;
            }
            setSpecialsImages(await response.json());
        } catch (error) {
            console.error(error);
        }
    }


    // Get specials images on mount
    useEffect(() => {
        getProducts('specials');
    }, []);


    // Set last page visited
    useEffect(() => {
        setLastPage(location.pathname);
    }, []); // Empty array ensures this runs only on mount


    return (
        <div>
            <div className='landing-page-bg'>
                <div className='landin-page-bg-model'>
                    <Navbar className="navbar" />
                    <img className='landing-page-image' src={landingPageImage} alt="" />                    {/* <Navbar /> */}
                    <div className='landing-page-heading-position'>
                        <div className='landing-page-heading'>
                            Raining Offers for {MonthOffers[new Date().getMonth()]}
                        </div>
                        <div className='landing-page-sub-heading'>
                            25% Off On All Products
                        </div>
                        <div className='landing-page-btns'>
                            <button className='landing-page-btn1'>Shop Now</button>
                            <div className='landing-page-btn2-pos'>
                                <button className='landing-page-btn2'>Learn More</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='brand-carousel-pos'>
                <div className='brand-carousel-container'>
                    <div className='brand-carousel'>
                        <div className="carousel" style={gridStyle}>
                            {brandNames.map((brand, index) => (
                                <div key={index} className="">
                                    <div className='landing-page-brand-name-styling' >
                                        {brand.icon} {brand.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='trial-product-card-container'>
                {
                    specialsImages && specialsImages.map((image, index) => (
                        <div className='card trial-product-card' key={index}>
                            <img className='img-specials' src={image} alt="" />
                            <div className='trial-product-card-details'>
                                <div className='trial-product-card-heading'>
                                    Let's Suit Up
                                </div>
                                <div className='trial-product-card-sub-heading'>
                                    Lorem ipsum dolor sit amet
                                </div>
                                <div className='trial-product-card-btn'>
                                    <button className='trial-product-card-btn1'>SEE MORE</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className='featured-products'>
                <div className='featured-products-heading'>
                    Featured Products
                </div>
            </div>
        </div>
    )
}

export default LandingPage