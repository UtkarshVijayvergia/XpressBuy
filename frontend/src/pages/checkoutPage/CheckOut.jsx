import React from 'react'

import Navbar from '../../components/navbar/Navbar'
import { TransactionContext } from '../../contexts/TransactionContext'
import { InstaBuyContext } from '../../contexts/InstaBuyContext'


const CheckOut = () => {

    const { transactionDetails, setTransactionDetails } = React.useContext(TransactionContext);
    const { instaBuy } = React.useContext(InstaBuyContext);


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
                    </div>
                :
                <h3>Transaction Session Expired</h3>
            }
        </div>
    )
}

export default CheckOut