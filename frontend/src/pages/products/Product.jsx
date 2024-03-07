import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'

import StarRating from '../../components/star-rating/StarRating'
import './product.css'


const Product = () => {
    const location = useLocation();
    const [productDetails, setProductDetails] = useState([]);
    const [colourName, setColourName] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [originalImage, setOriginalImage] = useState('');
    const [currentProductVariation, setCurrentProductVariation] = useState('');
    const [currentProductSize, setCurrentProductSize] = useState();
    const [buyQuantity, setBuyQuantity] = useState(1);


    // Get product details
    const getProductDetails = async (product_id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/products/product/${product_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            const data = await response.json();
            setProductDetails(data);
            setCurrentImage(data[0].base_imageURL);
            setOriginalImage(data[0].base_imageURL);
            getColourName(data[0].current_colour.slice(1));
        } catch (error) {
            console.error(error);
        }
    }


    // Get product variation
    const getProductVariation = async (product_id, colour) => {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/products/${product_id}/${colour}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            setCurrentProductVariation(await response.json());
        }
        catch (error) {
            console.error(error);
        }
    }


    // Get colour name
    const getColourName = async (colour) => {
        try {
            const response = await fetch(`http://localhost:5000/external/colour/${colour}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            setColourName(await response.json());
        }
        catch (error) {
            console.error(error);
        }
    }


    // Change Image on click
    const changeImage = (imageURL, colour) => {
        setCurrentImage(imageURL);
        setOriginalImage(currentImage);
        getColourName(colour.slice(1));
        getProductVariation(productDetails[0].product_id, colour.slice(1));
        document.querySelector('.product-size-list-style').value = '';
        setCurrentProductSize();
    }


    // Size selector
    const sizeSelector = (size) => {
        setCurrentProductSize(size);
    }


    // Buy Quantity change handler
    const handleQuantityChange = (event) => {
        setBuyQuantity(event.target.value);
    };


    // useEffect to get product details on page load
    useEffect(() => {
        getProductDetails(location.pathname.split('/')[3]);
    }, []);


    return (
        <div>
            <Navbar />
            <div className="product-details-partition">
                <div className="product-image-coloum">
                    <div className="product-image-stick">
                        <div className="product-image-selector-container">
                            {
                                productDetails && productDetails[0] ?
                                    <img className='product-image-selector' src={currentImage} alt="product" /> :
                                    <img className='product-image-selector' src="https://via.placeholder.com/150" alt="product" />
                            }
                        </div>
                        <div className="product-image-container">
                            {
                                productDetails && productDetails[0] ?
                                    <img className='product-image' src={currentImage} alt="product" /> :
                                    <img className='product-image' src="https://via.placeholder.com/150" alt="product" />
                            }
                        </div>
                    </div>
                </div>
                <div className="product-details-col-container">
                    {
                        productDetails && productDetails[0] ?
                            <div className="product-details-container">
                                <div className="product-name">
                                    {productDetails[0].product_name}
                                </div>
                                <div className='product-review-rating-details'>
                                    <div className='product-rating-details'>
                                        {productDetails[0].product_rating}
                                    </div>
                                    <div className='product-rating-star-details'>
                                        <StarRating rating={productDetails[0].product_rating} />
                                    </div>
                                    <div className="product-rating-review-partition">
                                        |
                                    </div>
                                    <div className="product-review-details">
                                        {productDetails[0].product_reviews} reviews
                                    </div>
                                </div>
                                <div className="product-description-details">
                                    {(Math.floor(productDetails[0].product_sold / 10)) * 10}+ products sold up till now
                                </div>
                                <div className="horizontal-line"></div>
                                <div className="product-pricing-details">
                                    <div className="product-pricing-heading">
                                        Price:
                                    </div>
                                    <div className="product-pricing">
                                        ${productDetails[0].product_price}
                                    </div>
                                </div>
                                <div className="product-colour-details">
                                    <div className="product-colour-heading">
                                        Colour:&nbsp;
                                    </div>
                                    <div className="product-colour-display" style={{ backgroundColor: `#${colourName.hexCode}` }}></div>
                                    <div className="product-colour" style={{ color: `Black` }}>
                                        {colourName && colourName.name ? colourName.name : `#${colourName.hexCode}`}
                                    </div>
                                </div>
                                <div className="product-size-details">
                                    <div className="product-size-heading">
                                        Size:&nbsp;
                                    </div>
                                    <div className="product-size-list">
                                        <select className='product-size-list-style' onChange={(e) => sizeSelector(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="X-Small">X-Small</option>
                                            <option value="Small">Small</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Large">Large</option>
                                            <option value="X-Large">X-Large</option>
                                            <option value="XX-Large">XX-Large</option>
                                            <option value="XXX-Large">XXX-Large</option>
                                        </select>
                                        <div className="product-stock-details">
                                            {
                                                currentProductVariation && currentProductVariation[0] && currentProductSize ?
                                                    <div>
                                                        {currentProductVariation[0].size_variation[currentProductSize].product_stock} items left in stock
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="product-variation-images">
                                    {
                                        productDetails[0].available_colours.map((val, index) => {
                                            return (
                                                <div className="product-variation-images-list">
                                                    <img className='product-variation-single-image' key={index}
                                                        src={productDetails[0][`${val}_imageURL`]} alt='product'
                                                        onMouseOver={() => setCurrentImage(productDetails[0][`${val}_imageURL`])}
                                                        onMouseOut={() => setCurrentImage(originalImage)}
                                                        onClick={() => changeImage(productDetails[0][`${val}_imageURL`], val)}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="product-description">
                                    <div className="product-description-heading">
                                        Product Details:
                                    </div>
                                    <div className="product-description-content">
                                        {
                                            productDetails[0].product_description.map((val, index) => {
                                                return (
                                                    <div className='product-desc' key={index}>
                                                        &bull; {val}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>
                <div className="cart-column">
                    <div className="buy-cart-padder">
                        <div className="buy-details">
                            <div className="buy-heading">
                                To Buy, Select <b>Size</b>
                            </div>
                            <div className="buy-quantity-input">
                                <label className='buy-quantity-label-style'>Quantity: </label>
                                <input
                                    className='buy-quantity-input-style'
                                    type="number"
                                    value={buyQuantity}
                                    onChange={handleQuantityChange}
                                />
                            </div>
                            <div className='add-to-cart'>
                                <div className="cart-half-circle-left"></div>
                                <div className="cart-button">
                                    Add to Cart
                                </div>
                                <div className="cart-half-circle-right"></div>
                            </div>
                            <div className='buy-now'>
                                <div className="buy-half-circle-left"></div>
                                <div className="buy-button">
                                    Buy Now
                                </div>
                                <div className="buy-half-circle-right"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product