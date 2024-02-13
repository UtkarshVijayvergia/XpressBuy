import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import { FaTshirt, FaBook, FaLaptop, FaGamepad, FaCreditCard, FaPaypal, FaCcMastercard } from 'react-icons/fa'
import { FaShirtsinbulk, FaShoppingCart, FaIdBadge, FaUserTie, FaVest } from 'react-icons/fa'
import './landingPage.css'

const LandingPage = () => {
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
        // gridTemplateColumns: `repeat(7, auto)`,
        gridTemplateColumns: `repeat(14, calc(auto))`,
        animation: 'scroll 20s linear infinite',
        gridGap: '20px',
        // overflow: 'hidden',
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


    console.log();

    return (
        <div>
            <div className='landing-page-bg'>
                <div className='landin-page-bg-model'>
                    <Navbar />
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
                        {/* style={{paddingLeft: "50px"}} */}
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
            <div className='trial-product-card-pos'>
                <div className='card trial-product-card'>
                    <div className='trial-product-card-details'>
                        <div className='trial-product-card-heading'>
                            Let's Suit Up
                        </div>
                        <div className='trial-product-card-sub-heading'>
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                        </div>
                        <div className='trial-product-card-btn'>
                            <button className='trial-product-card-btn1'>SEE MORE</button>
                        </div>
                    </div>
                </div>
                <div className='card trial-product-card'>
                    <div className='trial-product-card-details'>
                        <div className='trial-product-card-heading'>
                            Let's Suit Up
                        </div>
                        <div className='trial-product-card-sub-heading'>
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                        </div>
                        <div className='trial-product-card-btn'>
                            <button className='trial-product-card-btn1'>SEE MORE</button>
                        </div>
                    </div>
                </div>
                <div className='card trial-product-card'>
                    <div className='trial-product-card-details'>
                        <div className='trial-product-card-heading'>
                            Let's Suit Up
                        </div>
                        <div className='trial-product-card-sub-heading'>
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                        </div>
                        <div className='trial-product-card-btn'>
                            <button className='trial-product-card-btn1'>SEE MORE</button>
                        </div>
                    </div>
                </div>
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