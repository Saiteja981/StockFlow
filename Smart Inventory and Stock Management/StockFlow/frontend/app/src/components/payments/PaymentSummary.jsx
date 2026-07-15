import React from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const PaymentSummary = ({ transaction }) => {
    if (!transaction) return null

    return (
        <div className="card shadow">
            <div className="card-body text-center py-4">
                {transaction.success ? (
                    <>
                        <FaCheckCircle size={60} className="text-success mb-3" />
                        <h3 className="text-success">Payment Successful!</h3>
                        <p className="text-muted">
                            Your payment has been processed successfully.
                        </p>
                        <div className="border-top pt-3 mt-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <small className="text-muted">Transaction ID</small>
                                    <p className="fw-bold">{transaction.transactionId}</p>
                                </div>
                                <div className="col-md-6">
                                    <small className="text-muted">Amount</small>
                                    <p className="fw-bold text-success">
                                        ${transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <small className="text-muted">Date</small>
                                    <p>{new Date(transaction.date).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <FaTimesCircle size={60} className="text-danger mb-3" />
                        <h3 className="text-danger">Payment Failed</h3>
                        <p className="text-muted">
                            {transaction.message || 'Please try again or use a different payment method.'}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default PaymentSummary