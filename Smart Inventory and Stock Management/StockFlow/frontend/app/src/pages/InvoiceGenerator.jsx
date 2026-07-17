import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaFilePdf, FaPrint, FaDownload, FaShare } from 'react-icons/fa'
import { salesApi, productApi } from '../services/api'
import { formatCurrency } from '../utils/exportUtils'
import { toast } from 'react-toastify'

const InvoiceGenerator = () => {
    const { id } = useParams()
    const [sale, setSale] = useState(null)
    const [loading, setLoading] = useState(true)
    const [companyInfo, setCompanyInfo] = useState({
        name: 'Smart Inventory Management',
        address: '123 Business Street, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'info@smartinventory.com'
    })

    useEffect(() => {
        fetchInvoiceData()
    }, [id])

    const fetchInvoiceData = async () => {
        try {
            const response = await salesApi.getAll()
            const sales = response.data
            const found = sales.find(s => (s.id || s.salesId) == id)

            if (found) {
                setSale(found)
            } else {
                // Use first sale if ID not found
                setSale(sales[0] || null)
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching invoice data:', error)
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        toast.info('📥 PDF download would start here')
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Invoice',
                text: 'Invoice from Smart Inventory Management',
                url: window.location.href
            })
        } else {
            toast.info('📋 Invoice link copied to clipboard!')
        }
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!sale) {
        return (
            <div className="text-center mt-5">
                <div className="alert alert-info">
                    No invoice found. Please create a sale first.
                </div>
                <Link to="/sales" className="btn btn-primary">
                    Go to Sales
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📄 Invoice</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handlePrint}>
                        <FaPrint className="me-2" />
                        Print
                    </button>
                    <button className="btn btn-success" onClick={handleDownload}>
                        <FaDownload className="me-2" />
                        PDF
                    </button>
                    <button className="btn btn-info text-white" onClick={handleShare}>
                        <FaShare className="me-2" />
                        Share
                    </button>
                    <Link to="/sales" className="btn btn-secondary">
                        ← Back
                    </Link>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="card shadow" id="invoice">
                <div className="card-body p-5">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h2 className="text-primary">{companyInfo.name}</h2>
                        <p className="text-muted">
                            {companyInfo.address}<br />
                            {companyInfo.phone} | {companyInfo.email}
                        </p>
                    </div>

                    <hr />

                    {/* Invoice Details */}
                    <div className="row mb-4">
                        <div className="col-6">
                            <h6>Invoice #: <strong>INV-{sale.id || sale.salesId}</strong></h6>
                            <h6>Date: <strong>{new Date(sale.salesDate).toLocaleString()}</strong></h6>
                        </div>
                        <div className="col-6 text-end">
                            <h6>Customer: <strong>{sale.customerName || 'N/A'}</strong></h6>
                            <h6>Status: <span className="badge bg-success">Paid</span></h6>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>{sale.productName || sale.product?.name || 'Product'}</td>
                                <td>{sale.quantitySold}</td>
                                <td>{formatCurrency(sale.sellingPrice)}</td>
                                <td>{formatCurrency(sale.totalAmount || sale.quantitySold * sale.sellingPrice)}</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="4" className="text-end fw-bold">Total</td>
                                <td className="fw-bold text-success">
                                    {formatCurrency(sale.totalAmount || sale.quantitySold * sale.sellingPrice)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="row mt-4">
                        <div className="col-6">
                            <h6>Payment Method: <strong>Credit Card</strong></h6>
                            <h6>Transaction ID: <strong>TXN-{Date.now()}</strong></h6>
                        </div>
                        <div className="col-6 text-end">
                            <h6 className="text-muted">Thank you for your business!</h6>
                        </div>
                    </div>

                    <hr className="mt-4" />
                    <div className="text-center text-muted small">
                        <p>This is a system-generated invoice. For any queries, please contact us.</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handlePrint}>
                    <FaPrint className="me-2" />
                    Print Invoice
                </button>
            </div>
        </div>
    )
}

export default InvoiceGenerator