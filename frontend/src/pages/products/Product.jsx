import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// AWS Amplify
// import { Auth } from 'aws-amplify'
import { ulid } from 'ulid'

import Navbar from '../../components/navbar/Navbar'
import StarRating from '../../components/star-rating/StarRating'
import Reviews from './productDetailsPage/Reviews'
import { LastPageContext } from '../../contexts/LastPageContext';
import { TransactionContext } from '../../contexts/TransactionContext'
import { InstaBuyContext } from '../../contexts/InstaBuyContext'
import './product.css'


const Product = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { setLastPage } = useContext(LastPageContext);
    const { setTransactionDetails } = useContext(TransactionContext);
    const { setInstaBuy } = useContext(InstaBuyContext);


    // useState hooks
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const [colourName, setColourName] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [originalImage, setOriginalImage] = useState('');
    const [currentProductVariation, setCurrentProductVariation] = useState('');
    const [currentProductSize, setCurrentProductSize] = useState();
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [buyNowValidation, setBuyNowValidation] = useState('');
    const [addToCartValidation, setAddToCartValidation] = useState('');
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });


    // Predefined sizes for the product
    const allSizes = ["X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "XXX-Large"];


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
            getProductVariation(data[0].product_id, data[0].current_colour.slice(1));
            setBuyQuantity(1);
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
        if(event.target.value < 1){
            setBuyQuantity(1);
            return;
        }
        setBuyQuantity(event.target.value);
    };


    // Check if user is authenticated
    const checkUser = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/v1/tokenVerification/verifyAccessToken', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if(data.isAuthenticated){
                // setIsAuthenticated(true);
                return true;
            }
            return false;
        }
        catch(error){
            // setIsAuthenticated(false)
            console.log(error);
            return false;
        }
    }


    // Buy Now handler
    const buyNowHandler = async () => {
        if (currentProductSize) {
            if (currentProductVariation && currentProductVariation[0] && currentProductSize && currentProductVariation[0].size_variation[currentProductSize].product_stock >= buyQuantity) {
                if (await checkUser()) {
                    setBuyNowValidation('Navigating to checkout page...');
                    const currOrder_id = ulid();
                    setTransactionDetails({
                        order_id: currOrder_id,
                        isCart: false,
                        cart_id: '',
                        shippingAddress: '',
                        amount: 0,
                    });
                    setInstaBuy({
                        product_id: productDetails[0].product_id,
                        color_id: productDetails[0].current_colour,
                        product_image: originalImage,
                        size_id: currentProductSize,
                        productQuantity: buyQuantity,
                        productPrice: productDetails[0].product_price,
                        totalAmount: productDetails[0].product_price * buyQuantity,
                    });
                    setTimeout(() => {
                        setBuyNowValidation('');
                    }, 1000);
                    navigate(`/checkout/${currOrder_id}`);
                }
                else {
                    setBuyNowValidation('Please SIGN IN to continue...');
                    setTimeout(() => {
                        setBuyNowValidation('');
                    }, 1000);
                }
            }
            else {
                setBuyNowValidation('Product out of stock');
                setTimeout(() => {
                    setBuyNowValidation('');
                }, 1000);
            }
        }
        else {
            setBuyNowValidation('Please select size');
            setTimeout(() => {
                setBuyNowValidation('');
            }, 1000);
        }
    }


    // Add to Cart handler
    const addToCartHandler = async () => {
        if (currentProductSize) {
            if (currentProductVariation && currentProductVariation[0] && currentProductSize && currentProductVariation[0].size_variation[currentProductSize].product_stock >= buyQuantity) {
                if (await checkUser()) {
                    setBuyNowValidation('Product Added to your Cart');
                    setTimeout(() => {
                        setBuyNowValidation('');
                    }, 1000);
                }
                else {
                    setBuyNowValidation('Please SIGN IN to continue...');
                    setTimeout(() => {
                        setBuyNowValidation('');
                    }, 1000);
                }
            }
            else {
                setAddToCartValidation('Product out of stock');
                setTimeout(() => {
                    setAddToCartValidation('');
                }, 1000);
            }
        }
        else {
            setAddToCartValidation('Please select size');
            setTimeout(() => {
                setAddToCartValidation('');
            }, 1000);
        }
    }

    
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


    // useEffect to get product details on page load
    useEffect(() => {
        getProductDetails(location.pathname.split('/')[3]);
    }, []);


    // Set last page visited
    useEffect(() => {
        setLastPage(location.pathname);
    }, []); // Empty array ensures this runs only on mount


    return (
        <div>
            <Navbar />
            <div className="product-details-partition">
                <div className="product-image-coloum">
                    <div className="product-image-stick">
                        {
                            windowSize.width > 768 ?
                                <div className="product-image-selector-container">
                                    {
                                        productDetails && productDetails[0] ?
                                            <img className='product-image-selector' src={currentImage} alt="product" /> :
                                            <img className='product-image-selector' src="https://via.placeholder.com/150" alt="product" />
                                    }
                                </div>
                                :
                                <></>
                        }
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
                                            {
                                                currentProductVariation && currentProductVariation[0] && allSizes.map(size => (
                                                    <option
                                                        value={size}
                                                        disabled={!currentProductVariation[0].size_variation[size]}
                                                    >
                                                        {size}
                                                    </option>
                                                ))
                                            }
                                            {
                                                currentProductVariation && currentProductVariation[0] &&
                                                Object.keys(currentProductVariation[0].size_variation).map(size => (
                                                    !allSizes.includes(size) && <option value={size}>{size}</option>
                                                ))
                                            }
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
                                                <div className="product-variation-images-list" key={index}>
                                                    <img className='product-variation-single-image'
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
                            <div className='add-to-cart' onClick={addToCartHandler}>
                                <div className="half-circle-container">
                                    <div className="half-circle" style={{ "backgroundColor": `rgb(255, 200, 0)`, "transform": `translateX(20px)` }}></div>
                                </div>
                                <div className="cart-button" style={{ "backgroundColor": `rgb(255, 200, 0)` }}>
                                    Add to Cart
                                </div>
                                <div className="half-circle-container">
                                    <div className="half-circle" style={{ "backgroundColor": `rgb(255, 200, 0)`, "transform": `translateX(-20px)` }}></div>
                                </div>
                            </div>
                            {
                                addToCartValidation ?
                                    <div className="buy-validation">
                                        {addToCartValidation}
                                    </div>
                                    :
                                    <></>
                            }
                            <div className='buy-now' onClick={buyNowHandler}>
                                <div className="half-circle-container">
                                    <div className="half-circle" style={{ "backgroundColor": `rgb(255, 128, 0)`, "transform": `translateX(20px)` }}></div>
                                </div>
                                <div className="buy-button" style={{ "backgroundColor": `rgb(255, 128, 0)` }}>
                                    Buy Now
                                </div>
                                <div className="half-circle-container">
                                    <div className="half-circle" style={{ "backgroundColor": `rgb(255, 128, 0)`, "transform": `translateX(-20px)` }}></div>
                                </div>
                            </div>
                            {
                                buyNowValidation ?
                                    <div className="buy-validation">
                                        {buyNowValidation}
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="product-review-partition">
                <hr />
            </div>
            <div className="product-reviews">
                <Reviews />
            </div>
        </div>
    )
}

export default Product