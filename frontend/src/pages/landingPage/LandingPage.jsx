import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import { FaTshirt, FaBook, FaLaptop, FaGamepad, FaCreditCard, FaPaypal, FaCcMastercard } from 'react-icons/fa'
import './landingPage.css'

const LandingPage = () => {
    const brandNames = [
        <div className='landing-page-brand-name'><FaTshirt /> ADIBAS</div>,
        <div className='landing-page-brand-name'><FaBook /> PUCA</div>,
        <div className='landing-page-brand-name'><FaCcMastercard /> REEBOSS</div>,
        <div className='landing-page-brand-name'><FaGamepad /> US COLO</div>,
        <div className='landing-page-brand-name'><FaCreditCard /> PARROW</div>,
        <div className='landing-page-brand-name'><FaPaypal /> PIKE</div>,
        <div className='landing-page-brand-name'><FaTshirt /> ADIBAS</div>,
        <div className='landing-page-brand-name'><FaBook /> PUCA</div>,
        <div className='landing-page-brand-name'><FaCcMastercard /> REEBOSS</div>,
        <div className='landing-page-brand-name'><FaGamepad /> US COLO</div>,
        <div className='landing-page-brand-name'><FaCreditCard /> PARROW</div>,
        <div className='landing-page-brand-name'><FaPaypal /> PIKE</div>,
    ];

    return (
        <div>
            <div className='landing-page-bg'>
                <div className='landin-page-bg-model'>
                    <Navbar />
                    <div className='landing-page-heading-position'>
                        <div className='landing-page-heading'>
                            Raining Offers for Frosty January
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
                        <div className="carousel">
                            {brandNames.map((brand, index) => (
                                <div key={index} className="brand-name">
                                    {brand}
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