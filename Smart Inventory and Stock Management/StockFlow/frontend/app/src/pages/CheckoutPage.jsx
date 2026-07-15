import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle, FaClock } from 'react-icons/fa'
import PaymentForm from '../components/payments/PaymentForm'
import PaymentSummary from '../components/payments/PaymentSummary'

// ✅ Add formatCurrency helper function
const formatCurrency = (amount) => {
    return '$' + parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const CheckoutPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [transaction, setTransaction] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('credit_card')

    // Get amount from location state or default
    const amount = location.state?.amount || 100.00
    const items = location.state?.items || []

    const handlePaymentComplete = (result) => {
        setTransaction({
            success: true,
            ...result
        })
        // Save transaction to localStorage for success page
        localStorage.setItem('lastTransaction', JSON.stringify({
            success: true,
            ...result
        }))
    }

    const handleCancel = () => {
        navigate('/')
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="d-flex align-items-center mb-4">
                    <Link to="/" className="btn btn-outline-secondary me-3">
                        <FaArrowLeft />
                    </Link>
                    <h2 className="mb-0">💳 Checkout</h2>
                </div>

                {/* Order Summary */}
                {items.length > 0 && (
                    <div className="card shadow mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">📦 Order Summary</h5>
                        </div>
                        <div className="card-body">
                            {items.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between py-2 border-bottom">
                                    <span>{item.name}</span>
                                    <span>{formatCurrency(item.price)} x {item.quantity}</span>
                                    <span className="fw-bold">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between pt-3">
                                <span className="fw-bold">Total</span>
                                <span className="fw-bold text-success">{formatCurrency(amount)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Form or Summary */}
                {!transaction ? (
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">💳 Payment Details</h5>
                        </div>
                        <div className="card-body">
                            <PaymentForm
                                amount={amount}
                                onPaymentComplete={handlePaymentComplete}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <PaymentSummary transaction={transaction} />
                        <div className="text-center mt-4">
                            <Link to="/" className="btn btn-primary">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CheckoutPage