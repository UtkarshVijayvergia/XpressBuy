import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './categories.css'
import Navbar from '../../components/navbar/Navbar'


const Categories = () => {
    const [products, setProducts] = useState([]);

    // Get all products
    const getProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/products', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            setProducts(await response.json());
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div>
            <Navbar />
            <div className='cat-product-container'>
                <div className='left-column'>

                </div>
                <div className='right-column'>
                    {
                        products.map((image, index) => {
                            return (
                                <div key={index} className='product-card'>
                                    <img src={products[index][0].imageURL} alt='product' />
                                    <div className='product-details'>
                                        <div className='product-name'>
                                            { products[index][0].name }
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