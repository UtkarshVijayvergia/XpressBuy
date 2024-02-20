import React from 'react'
import { useNavigate } from 'react-router-dom'
import './categories.css'
import Navbar from '../../components/navbar/Navbar'

const Categories = () => {

    const images = [
        'https://xpressbuy.s3.ap-south-1.amazonaws.com/temp/green_tshirt.jpeg',
        'https://xpressbuy.s3.ap-south-1.amazonaws.com/temp/blue-tshirt-modern.jpeg',
        'https://xpressbuy.s3.ap-south-1.amazonaws.com/temp/red_tshirt_folded.jpeg',
        'https://xpressbuy.s3.ap-south-1.amazonaws.com/temp/something.jpeg',
        'https://xpressbuy.s3.ap-south-1.amazonaws.com/temp/sommething_black.jpeg',
    ]

    return (
        <div>
            <Navbar />
            <div className='cat-product-container'>
                <div className='left-column'>

                </div>
                <div className='right-column'>
                    {
                        images.map((image, index) => {
                            return (
                                <div key={index} className='product-card'>
                                    <img src={image} alt='product' />
                                    <div className='product-details'>
                                        <div className='product-name'>
                                            Product Name
                                        </div>
                                        <div className='product-price'>
                                            $100
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Categories