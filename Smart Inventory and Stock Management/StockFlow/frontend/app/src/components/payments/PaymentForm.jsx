import React, { useState } from 'react'
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa'
import { validateCardNumber, validateExpiry, formatCardNumber } from '../../utils/paymentUtils'

// ✅ Add formatCurrency helper function
const formatCurrency = (amount) => {
    return '$' + parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const PaymentForm = ({ amount, onPaymentComplete, onCancel }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const cardIcons = {
        visa: <FaCcVisa className="text-primary" size={30} />,
        mastercard: <FaCcMastercard className="text-danger" size={30} />,
        amex: <FaCcAmex className="text-info" size={30} />,
        discover: <FaCcDiscover className="text-warning" size={30} />
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'cardNumber') {
            const formatted = formatCardNumber(value)
            setFormData({ ...formData, cardNumber: formatted })
        } else {
            setFormData({ ...formData, [name]: value })
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' })
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'Please enter a valid card number'
        }

        if (!formData.cardName || formData.cardName.length < 3) {
            newErrors.cardName = 'Please enter the cardholder name'
        }

        if (!formData.expiryMonth || !formData.expiryYear) {
            newErrors.expiry = 'Please enter expiry date'
        } else if (!validateExpiry(parseInt(formData.expiryMonth), parseInt(formData.expiryYear))) {
            newErrors.expiry = 'Invalid expiry date'
        }

        if (!formData.cvv || formData.cvv.length < 3) {
            newErrors.cvv = 'Please enter CVV'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)

        try {
            const paymentData = {
                cardNumber: formData.cardNumber.replace(/\s/g, ''),
                cardName: formData.cardName,
                expiryMonth: parseInt(formData.expiryMonth),
                expiryYear: parseInt(formData.expiryYear),
                cvv: formData.cvv,
                amount: amount
            }

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            onPaymentComplete({
                success: true,
                transactionId: 'TXN-' + Date.now(),
                amount: amount,
                date: new Date().toISOString()
            })
        } catch (error) {
            setErrors({ submit: 'Payment failed. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label fw-bold">Card Number</label>
                <div className="input-group">
                    <input
                        type="text"
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                    />
                    <span className="input-group-text">
                        {cardIcons.visa}
                    </span>
                </div>
                {errors.cardNumber && <div className="invalid-feedback d-block">{errors.cardNumber}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">Cardholder Name</label>
                <input
                    type="text"
                    className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />
                {errors.cardName && <div className="invalid-feedback d-block">{errors.cardName}</div>}
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Expiry Date</label>
                    <div className="row g-2">
                        <div className="col-6">
                            <input
                                type="text"
                                className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                                name="expiryMonth"
                                value={formData.expiryMonth}
                                onChange={handleChange}
                                placeholder="MM"
                                maxLength="2"
                                required
                            />
                        </div>
                        <div className="col-6">
                            <input
                                type="text"
                                className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                                name="expiryYear"
                                value={formData.expiryYear}
                                onChange={handleChange}
                                placeholder="YY"
                                maxLength="2"
                                required
                            />
                        </div>
                    </div>
                    {errors.expiry && <div className="invalid-feedback d-block">{errors.expiry}</div>}
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">CVV</label>
                    <input
                        type="password"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="4"
                        required
                    />
                    {errors.cvv && <div className="invalid-feedback d-block">{errors.cvv}</div>}
                </div>
            </div>

            {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
            )}

            <div className="alert alert-info">
                <strong>💳 Test Payment</strong>
                <br />
                Use any card number (16 digits), any expiry, and any CVV for testing.
                <br />
                <small>Example: 4111 1111 1111 1111</small>
            </div>

            <div className="d-flex gap-2 mt-3">
                <button
                    type="submit"
                    className="btn btn-success flex-grow-1"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Processing...
                        </>
                    ) : (
                        // ✅ Use formatCurrency here
                        `Pay ${formatCurrency(amount)}`
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default PaymentForm