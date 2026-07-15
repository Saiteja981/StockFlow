import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine } from 'react-icons/fa'
import { productApi, purchaseApi, salesApi } from '../services/api'
import LowStockAlert from '../components/common/LowStockAlert'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalPurchases: 0,
        totalSales: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [productsRes, purchasesRes, salesRes] = await Promise.all([
                productApi.getAll(),
                purchaseApi.getAll(),
                salesApi.getAll()
            ])

            setStats({
                totalProducts: productsRes.data.length || 0,
                totalPurchases: purchasesRes.data.length || 0,
                totalSales: salesRes.data.length || 0
            })
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
        <>
            <LowStockAlert threshold={10} />

            {/* Centered Heading with RED Color */}
            <div className="text-center mb-4">
                <h2
                    className="dashboard-title"
                    style={{
                        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ff6b6b' : '#dc3545',
                        fontWeight: '700',
                        fontSize: '32px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}
                >
                    📊 Smart Inventory & Stock Management
                </h2>
                <Link to="/analytics" className="btn btn-info text-white mt-2">
                    <FaChartLine className="me-2" />
                    View Analytics
                </Link>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                    <div className="card shadow dashboard-card">
                        <div className="card-body text-center">
                            <h4>Add Product</h4>
                            <p>Add New Products</p>
                            <Link to="/addProduct" className="btn btn-success">
                                Open
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow dashboard-card">
                        <div className="card-body text-center">
                            <h4>Products</h4>
                            <p>View All Products</p>
                            <Link to="/products" className="btn btn-primary">
                                Open
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow dashboard-card">
                        <div className="card-body text-center">
                            <h4>Purchase</h4>
                            <p>Purchase Record</p>
                            <Link to="/purchase" className="btn btn-warning">
                                Open
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card shadow dashboard-card">
                        <div className="card-body text-center">
                            <h4>Sales</h4>
                            <p>Sales Record</p>
                            <Link to="/sales" className="btn btn-danger">
                                Open
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary">
                        <div className="card-body text-center">
                            <h5>Total Products</h5>
                            <h2>{stats.totalProducts}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success">
                        <div className="card-body text-center">
                            <h5>Total Purchases</h5>
                            <h2>{stats.totalPurchases}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-info">
                        <div className="card-body text-center">
                            <h5>Total Sales</h5>
                            <h2>{stats.totalSales}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard