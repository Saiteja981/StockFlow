import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBox, FaDollarSign, FaShoppingCart, FaUsers, FaBell } from 'react-icons/fa'
import { productApi, purchaseApi, salesApi } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currencyUtils'

const RealtimeDashboard = () => {
    const { currency } = useCurrency() // ✅ Get current currency
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalPurchases: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        lowStockCount: 0
    })
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    useEffect(() => {
        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchData = async () => {
        try {
            const [productsRes, purchasesRes, salesRes] = await Promise.all([
                productApi.getAll(),
                purchaseApi.getAll(),
                salesApi.getAll()
            ])

            const products = productsRes.data
            const sales = salesRes.data

            const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
            const customers = new Set(sales.map(s => s.customerName).filter(Boolean))
            const lowStock = products.filter(p => (p.stock || p.stockQuantity || 0) <= 10).length

            setStats({
                totalProducts: products.length,
                totalPurchases: purchasesRes.data.length,
                totalSales: sales.length,
                totalRevenue,
                totalCustomers: customers.size,
                lowStockCount: lowStock
            })
            setLastUpdated(new Date())
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
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

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    📊 Real-time Dashboard
                    <span className="badge bg-success ms-2">
                        <FaBell className="me-1" /> Live
                    </span>
                    <span className="badge bg-info ms-2">
                        {currency}
                    </span>
                </h2>
                <div>
                    <small className="text-muted">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </small>
                    <button
                        className="btn btn-sm btn-primary ms-2"
                        onClick={fetchData}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Total Products</h6>
                                    <h2 className="card-text">{stats.totalProducts}</h2>
                                    <small className="text-light">📦 In inventory</small>
                                </div>
                                <FaBox size={40} opacity={0.5} />
                            </div>
                            <div className="mt-2">
                                <span className="badge bg-light text-primary">Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Total Revenue</h6>
                                    {/* ✅ Format with currency */}
                                    <h2 className="card-text">{formatCurrency(stats.totalRevenue, currency)}</h2>
                                    <small className="text-light">💰 Total sales</small>
                                </div>
                                <FaDollarSign size={40} opacity={0.5} />
                            </div>
                            <div className="mt-2">
                                <span className="badge bg-light text-success">Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Active Sales</h6>
                                    <h2 className="card-text">{stats.totalSales}</h2>
                                    <small className="text-light">📈 This month</small>
                                </div>
                                <FaShoppingCart size={40} opacity={0.5} />
                            </div>
                            <div className="mt-2">
                                <span className="badge bg-light text-warning">Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-danger">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Low Stock Alert</h6>
                                    <h2 className="card-text">{stats.lowStockCount}</h2>
                                    <small className="text-light">⚠️ Need attention</small>
                                </div>
                                <FaBell size={40} opacity={0.5} />
                            </div>
                            <div className="mt-2">
                                <span className="badge bg-light text-danger">Alert</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <h6 className="text-info">Total Purchases</h6>
                            <h3>{stats.totalPurchases}</h3>
                            <small>📥 Incoming stock</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <h6 className="text-success">Total Customers</h6>
                            <h3>{stats.totalCustomers}</h3>
                            <small>👥 Unique buyers</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <h6 className="text-warning">Avg Order Value</h6>
                            {/* ✅ Format with currency */}
                            <h3>{formatCurrency(stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0, currency)}</h3>
                            <small>💰 Per transaction</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <h6 className="text-primary">Stock Turnover</h6>
                            <h3>{(stats.totalProducts > 0 ? (stats.totalSales / stats.totalProducts).toFixed(1) : '0')}x</h3>
                            <small>🔄 Sales per product</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary me-2">Dashboard</Link>
                <Link to="/analytics" className="btn btn-primary">Analytics</Link>
            </div>
        </div>
    )
}

export default RealtimeDashboard