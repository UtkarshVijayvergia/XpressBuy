import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'

import Navbar from '../../components/navbar/Navbar'
import StarRating from '../../components/star-rating/StarRating'
import ErrorPage from '../errorPage/ErrorPage'
import { LastPageContext } from '../../contexts/LastPageContext';
import './categories.css'


const Categories = () => {

    const location = useLocation();
    const { setLastPage } = useContext(LastPageContext);


    const [category, setCategory] = useState([])
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });


    // Post category name to get products
    const navigate = useNavigate();
    const handleCategory = (categoryName) => {
        setCategoryName(categoryName);
        navigate(`/products/${categoryName}`);
        getProducts(categoryName);
    }


    // Navigate to product page
    const productPageNavigator = (product_id) => {
        return () => {
            navigate(`${product_id}`);
        }
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
            if (!response.ok) {
                console.error(`Server responded with status code ${response.status}`);
                return;
            }
            setCategory(await response.json());
        } catch (error) {
            console.error(error);
        }
    }


    // Get all products
    const getProducts = async (categoryName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/products/${categoryName}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (!response.ok) {
                console.error(`Server responded with status code ${response.status}`);
                return;
            }
            setProducts(await response.json());
        } catch (error) {
            console.error(error);
        }
    }


    // useEffect
    useEffect(() => {
        getCategories();
        handleCategory(location.pathname.split('/')[2]);
    }, [categoryName]);


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


    // useEffect for setting last page
    useEffect(() => {
        setLastPage(location.pathname);
    }, []); // Empty array ensures this runs only on mount


    return (
        <div>
            {products.length > 0 ?
                <>
                    <Navbar setCategoryName={setCategoryName} handleCategory={handleCategory} />
                    <div className='cat-product-container'>
                        <div className='left-column'>
                            {
                                windowSize.width > 1280 ?
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
                                    :
                                    <></>
                            }
                        </div>
                        <div className='right-column'>
                            {
                                products.map((image, index) => {
                                    return (
                                        <div key={index} className='product-card' onClick={productPageNavigator(products[index][0].product_id)}>
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
                    </div>
                </>
                :
                <div className='no-products'>
                    <ErrorPage />
                </div>
            }
        </div>
    )
}

export default Categories