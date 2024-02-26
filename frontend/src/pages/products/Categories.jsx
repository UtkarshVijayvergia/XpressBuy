import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import './categories.css'
import Navbar from '../../components/navbar/Navbar'
import StarRating from '../../components/star-rating/StarRating'


const Categories = () => {
    const { id } = useParams();
    const [category, setCategory] = useState([])
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('018DE5AA-91A7-BD3C-F93C-C1FADA5DC1C4');

    // Post category name to get products
    const navigate = useNavigate();
    const handleCategory = (categoryName) => {
        setCategoryName(categoryName);
        console.log(categoryName);
        navigate(`/products/${categoryName}`);
    }

    // Get all categories
    const getCategories = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/category`, {
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
            const response = await fetch(`http://localhost:5000/api/v1/products/${categoryName}`, {
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
    }, [categoryName]);


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
                                                    ((index === 0) || (index === 2)) 
                                                    ?
                                                    <div className='category-name category-name-lower' onClick={() => handleCategory(`${category.sk}`)}>
                                                        {category.category_name}
                                                        <div className="category-quantity">
                                                            ({category.product_quantity})
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='category-name' onClick={() => handleCategory(`${category.sk}`)}>
                                                        {category.category_name}
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
                                    <img className='product-image' src={products[index][0].imageURL} alt='product' />
                                    <div className='product-details'>
                                        <div className='product-name'>
                                            {products[index][0].product_name}
                                        </div>
                                        <div className='product-review-rating'>
                                            <div className='product-rating-star'>
                                                <StarRating rating={products[index][0].product_rating} /> 
                                            </div>
                                            <div className='product-rating'>
                                                ({products[index][0].product_rating})
                                            </div>
                                            
                                                <div className="product-inverse-carrot">
                                                    <sup>` </sup>
                                                </div>
                                                <div className="product-reviews">
                                                <sup>{products[index][0].product_reviews}</sup>
                                                </div>
                                            
                                        </div>
                                        <div className="product-sold">
                                            {products[index][0].product_sold}+ bought this product
                                        </div>
                                        <div className="product-price-details">
                                            <div className="product-price-currency">
                                                <sup>Rs.</sup>
                                            </div>
                                            <div className='product-price'>
                                                {products[index][0].product_price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='page-end'>
                {/* <hr /> */}
            </div>
        </div>
    )
}

export default Categories