import React from 'react'

import Navbar from '../../components/navbar/Navbar'
import { TransactionContext } from '../../contexts/TransactionContext'
import { InstaBuyContext } from '../../contexts/InstaBuyContext'
import './checkOut.css'


const CheckOut = () => {

    const { transactionDetails, setTransactionDetails } = React.useContext(TransactionContext);
    const { instaBuy, setInstaBuy } = React.useContext(InstaBuyContext);


    // Token Verification
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
                return true;
            }
            return false;
        }
        catch(error){
            console.log(error);
            return false;
        }
    }


    // Transaction Confirmation Handler
    const TransactionConfirmationHandler = async (e) => {
        e.preventDefault();
        try {
            if(await checkUser()){
                const response = await fetch(`http://localhost:5000/api/v1/order/${transactionDetails.order_id}/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: transactionDetails.user_id,
                        order_id: transactionDetails.order_id,
                        items: instaBuy,
                        total_amount: instaBuy.totalAmount,
                        shipping_address: transactionDetails.shippingAddress,
                        created_at: new Date().toISOString()
                    })
                });
                alert('Transaction Successful');
                if (response.status === 200) {
                    setTransactionDetails({
                        order_id: '',
                        isCart: false,
                        cart_id: '',
                        shippingAddress: '',
                        amount: 0,
                    });
                    setInstaBuy({
                        product_id: '',
                        color_id: '',
                        product_image: '',
                        size_id: '',
                        productQuantity: 0,
                        productPrice: 0,
                        totalAmount: 0,
                    });
                }
                else {
                    alert('Transaction Failed! Please try again later.');
                }
            }
            else{
                alert('Session Expired');
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            <Navbar />
            <h1>CheckOut</h1>
            {
                transactionDetails.order_id!=='' ?
                    transactionDetails.isCart ?
                    <div>
                        <h3>Cart Id: {transactionDetails.cart_id}</h3>
                        <h3>Shipping Address: {transactionDetails.shippingAddress}</h3>
                        <h3>Amount: {transactionDetails.amount}</h3>
                    </div>
                    :
                    <div>
                        <h3>Order Id: {transactionDetails.order_id}</h3>
                        <h3>Shipping Address: {transactionDetails.shippingAddress}</h3>
                        <h3>Product Image: {
                            instaBuy.product_image ?
                                <img src={instaBuy.product_image} alt="product_image" style={{ width: '200px', height: '200px' }} />
                                :
                                null
                        }</h3>
                        <h3>Product Id: {instaBuy.product_id}</h3>
                        <h3>Color Id: {instaBuy.color_id}</h3>
                        <h3>Size Id: {instaBuy.size_id}</h3>
                        <h3>Product Quantity: {instaBuy.productQuantity}</h3>
                        <h3>Product Price: {instaBuy.productPrice}</h3>
                        <h3>Total Amount: {instaBuy.totalAmount}</h3>
                        <div className="confirm-purchase-btn" onClick={TransactionConfirmationHandler}>Confirm Purchase</div>
                    </div>
                :
                <h3>Transaction Session Expired</h3>
            }
        </div>
    )
}

export default CheckOut