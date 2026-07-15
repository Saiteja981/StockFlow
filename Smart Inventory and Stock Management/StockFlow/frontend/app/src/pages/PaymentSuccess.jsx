import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaPrint, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'

const PaymentSuccess = () => {
    const location = useLocation()
    const [transaction, setTransaction] = useState(null)

    useEffect(() => {
        // Get transaction from location state or localStorage
        const tx = location.state?.transaction || JSON.parse(localStorage.getItem('lastTransaction') || 'null')
        if (tx) {
            setTransaction(tx)
        } else {
            toast.error('No transaction found')
        }
    }, [location])

    const handlePrint = () => {
        window.print()
    }

    if (!transaction) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-6">
                <div className="card shadow">
                    <div className="card-body text-center py-5">
                        <FaCheckCircle size={80} className="text-success mb-4" />
                        <h2 className="text-success">Payment Successful!</h2>
                        <p className="text-muted">
                            Thank you for your payment. Your transaction has been completed.
                        </p>

                        <div className="bg-light p-4 rounded my-4 text-start">
                            <div className="row">
                                <div className="col-6">
                                    <small className="text-muted">Transaction ID</small>
                                    <p className="fw-bold">{transaction.transactionId}</p>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted">Amount</small>
                                    <p className="fw-bold text-success">
                                        ${transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted">Date</small>
                                    <p>{new Date(transaction.date).toLocaleString()}</p>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted">Status</small>
                                    <span className="badge bg-success">Completed</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                            <button className="btn btn-outline-secondary" onClick={handlePrint}>
                                <FaPrint className="me-2" />
                                Print Receipt
                            </button>
                            <button className="btn btn-outline-primary">
                                <FaEnvelope className="me-2" />
                                Email Receipt
                            </button>
                            <Link to="/" className="btn btn-primary">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess