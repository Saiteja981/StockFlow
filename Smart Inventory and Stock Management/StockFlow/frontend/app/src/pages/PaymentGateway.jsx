import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaStripe, FaPaypal, FaCreditCard, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

const PaymentGateway = () => {
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState('stripe')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [transactionId, setTransactionId] = useState('')

    const handlePayment = async () => {
        setLoading(true)

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            const txId = 'TXN-' + Date.now()
            setTransactionId(txId)
            setSuccess(true)
            toast.success('✅ Payment processed successfully!')

            // Store transaction
            localStorage.setItem('lastTransaction', JSON.stringify({
                id: txId,
                method: paymentMethod,
                amount: 100.00,
                date: new Date().toISOString(),
                status: 'completed'
            }))
        } catch (error) {
            toast.error('❌ Payment failed')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow text-center p-5">
                        <FaCheckCircle size={80} className="text-success mx-auto mb-4" />
                        <h3 className="text-success">Payment Successful!</h3>
                        <p className="text-muted">Your payment has been processed successfully.</p>
                        <div className="border p-3 rounded bg-light">
                            <p><strong>Transaction ID:</strong> {transactionId}</p>
                            <p><strong>Method:</strong> {paymentMethod.toUpperCase()}</p>
                            <p><strong>Amount:</strong> $100.00</p>
                            <p><strong>Status:</strong> <span className="badge bg-success">Completed</span></p>
                        </div>
                        <div className="mt-3">
                            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-6">
                <div className="d-flex align-items-center mb-4">
                    <Link to="/checkout" className="btn btn-outline-secondary me-3">
                        <FaArrowLeft />
                    </Link>
                    <h2 className="mb-0">💳 Payment</h2>
                </div>

                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Select Payment Method</h5>
                    </div>
                    <div className="card-body">
                        {/* Payment Method Selection */}
                        <div className="mb-4">
                            <div className="d-flex gap-3 flex-wrap">
                                <button
                                    className={`btn ${paymentMethod === 'stripe' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setPaymentMethod('stripe')}
                                    style={{ padding: '15px 30px' }}
                                >
                                    <FaStripe className="me-2" /> Stripe
                                </button>
                                <button
                                    className={`btn ${paymentMethod === 'paypal' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setPaymentMethod('paypal')}
                                    style={{ padding: '15px 30px' }}
                                >
                                    <FaPaypal className="me-2" /> PayPal
                                </button>
                                <button
                                    className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setPaymentMethod('card')}
                                    style={{ padding: '15px 30px' }}
                                >
                                    <FaCreditCard className="me-2" /> Card
                                </button>
                            </div>
                        </div>

                        <hr />

                        {/* Payment Details */}
                        <div className="mb-4">
                            <h6>Payment Summary</h6>
                            <div className="d-flex justify-content-between">
                                <span>Product Price</span>
                                <span>$100.00</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>$100.00</span>
                            </div>
                        </div>

                        {paymentMethod === 'stripe' && (
                            <div className="alert alert-info">
                                <FaStripe className="me-2" />
                                <strong>Stripe</strong> - Secure credit card payment
                                <div className="mt-2">
                                    <small>Test Card: 4242 4242 4242 4242</small>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'paypal' && (
                            <div className="alert alert-primary">
                                <FaPaypal className="me-2" />
                                <strong>PayPal</strong> - Fast and secure checkout
                                <div className="mt-2">
                                    <small>You will be redirected to PayPal</small>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'card' && (
                            <div className="alert alert-success">
                                <FaCreditCard className="me-2" />
                                <strong>Credit/Debit Card</strong>
                                <div className="mt-2">
                                    <small>Direct card payment</small>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-success w-100 mt-3"
                            onClick={handlePayment}
                            disabled={loading}
                            style={{ padding: '12px' }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Processing...
                                </>
                            ) : (
                                `Pay $100.00 with ${paymentMethod.toUpperCase()}`
                            )}
                        </button>

                        <div className="mt-3">
                            <small className="text-muted">
                                🔒 Your payment is secure. We don't store your card details.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentGateway