import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './categories.css'
import Navbar from '../../components/navbar/Navbar'


const Categories = () => {
    const [category, setCategory] = useState([])
    const [products, setProducts] = useState([]);

    // Get all categories
    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/products/category', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            setCategory(await response.json());
        } catch (error) {
            console.error(error);
        }
    }

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

    // useEffect
    useEffect(() => {
        getCategories();
        getProducts();
    }, []);


    return (
        <div>
            <Navbar />
            <div className='cat-product-container'>
                <div className='left-column'>
                    <div className="left-column-placement">
                        <div className="category-left-column-heading">
                            Categories
                        </div>
                        <div className='category-list-placement'>
                            {
                                category.map((category, index) => {
                                    return (
                                        <div key={index} className='category-list'>
                                            <div className='category-name'>
                                                {
                                                    category.sk[0] >= '0' && category.sk[0] <= '9'
                                                        ?
                                                        category.sk[0] == 1
                                                            ?
                                                            <div className='category-name category-name-upper'>
                                                                EVERYTHING
                                                                <div className="category-quantity">
                                                                    ({category.product_quantity})
                                                                </div>
                                                            </div>
                                                            :
                                                            category.sk[0] == 2
                                                                ?
                                                                <div className='category-name category-name-upper'>
                                                                    MEN
                                                                    <div className="category-quantity">
                                                                        ({category.product_quantity})
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className=' category-name category-name-lower'>
                                                                    WOMEN
                                                                    <div className="category-quantity">
                                                                        ({category.product_quantity})
                                                                    </div>
                                                                </div>
                                                        :
                                                        <div className='category-name'>
                                                            {category.sk}
                                                            <div className="category-quantity">
                                                                ({category.product_quantity})
                                                            </div>
                                                        </div>
                                                }

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='right-column'>
                    {
                        products.map((image, index) => {
                            return (
                                <div key={index} className='product-card'>
                                    <img src={products[index][0].imageURL} alt='product' />
                                    <div className='product-details'>
                                        <div className='product-name'>
                                            {products[index][0].name}
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