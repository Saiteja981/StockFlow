import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { salesApi } from '../services/api'

const CustomersPage = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const response = await salesApi.getAll()
            // Extract unique customers from sales
            const customerMap = {}
            response.data.forEach(sale => {
                const name = sale.customerName || 'Anonymous'
                if (!customerMap[name]) {
                    customerMap[name] = {
                        name: name,
                        totalPurchases: 0,
                        totalSpent: 0,
                        lastPurchase: sale.salesDate,
                        products: []
                    }
                }
                customerMap[name].totalPurchases += 1
                customerMap[name].totalSpent += (sale.totalAmount || 0)
                customerMap[name].products.push(sale.productName || 'Unknown')
                if (new Date(sale.salesDate) > new Date(customerMap[name].lastPurchase)) {
                    customerMap[name].lastPurchase = sale.salesDate
                }
            })
            setCustomers(Object.values(customerMap))
            setLoading(false)
        } catch (error) {
            console.error('Error fetching customers:', error)
            setLoading(false)
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <FaUsers className="me-2" />
                    Customers
                    <span className="badge bg-secondary ms-2">{customers.length}</span>
                </h2>
                <Link to="/sales" className="btn btn-success">
                    <FaUserPlus className="me-2" />
                    New Sale
                </Link>
            </div>

            {/* Search */}
            <div className="mb-3">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text"><FaSearch /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredCustomers.length === 0 ? (
                <div className="alert alert-info">
                    No customers found. Start making sales to build your customer base!
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-dark">
                        <tr>
                            <th>Customer</th>
                            <th>Total Purchases</th>
                            <th>Total Spent</th>
                            <th>Last Purchase</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.map((customer, index) => (
                            <tr key={index}>
                                <td><strong>{customer.name}</strong></td>
                                <td>
                                        <span className="badge bg-primary">
                                            {customer.totalPurchases}
                                        </span>
                                </td>
                                <td>${customer.totalSpent.toFixed(2)}</td>
                                <td>{new Date(customer.lastPurchase).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-1">
                                        <FaEdit /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary me-2">Home</Link>
                <Link to="/sales" className="btn btn-success">Sales</Link>
            </div>
        </div>
    )
}

export default CustomersPage