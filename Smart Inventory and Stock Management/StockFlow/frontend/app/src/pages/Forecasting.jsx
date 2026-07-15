import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'
import { salesApi, productApi } from '../services/api'
import SalesChart from '../components/charts/SalesChart'
import { formatCurrency } from '../utils/exportUtils'

const Forecasting = () => {
    const [salesData, setSalesData] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [forecast, setForecast] = useState({
        nextMonth: 0,
        trend: 'stable',
        confidence: 0,
        topProducts: []
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [salesRes, productsRes] = await Promise.all([
                salesApi.getAll(),
                productApi.getAll()
            ])
            setSalesData(salesRes.data)
            setProducts(productsRes.data)
            calculateForecast(salesRes.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    const calculateForecast = (sales) => {
        // Simple moving average forecast
        const monthlySales = {}
        sales.forEach(s => {
            const month = new Date(s.salesDate).getMonth()
            monthlySales[month] = (monthlySales[month] || 0) + (s.totalAmount || 0)
        })

        const months = Object.keys(monthlySales).sort()
        const values = months.map(m => monthlySales[m])

        // Calculate trend
        let trend = 'stable'
        if (values.length > 1) {
            const last = values[values.length - 1]
            const prev = values[values.length - 2]
            if (last > prev * 1.1) trend = 'up'
            else if (last < prev * 0.9) trend = 'down'
        }

        // Simple forecast (average of last 3 months)
        const last3 = values.slice(-3)
        const avg = last3.length > 0 ? last3.reduce((a, b) => a + b, 0) / last3.length : 0

        // Top products
        const productSales = {}
        sales.forEach(s => {
            const name = s.productName || 'Unknown'
            productSales[name] = (productSales[name] || 0) + (s.quantitySold || 0)
        })

        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, qty]) => ({ name, quantity: qty }))

        setForecast({
            nextMonth: avg,
            trend: trend,
            confidence: values.length > 3 ? 85 : 60,
            topProducts: topProducts
        })
    }

    const getTrendIcon = () => {
        if (forecast.trend === 'up') return <FaArrowUp className="text-success" />
        if (forecast.trend === 'down') return <FaArrowDown className="text-danger" />
        return <FaMinus className="text-warning" />
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
                    <FaChartLine className="me-2" />
                    Sales Forecasting
                </h2>
                <Link to="/analytics" className="btn btn-secondary">
                    ← Back to Analytics
                </Link>
            </div>

            {/* Forecast Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h6 className="card-title">Forecasted Revenue</h6>
                            <h2 className="card-text">{formatCurrency(forecast.nextMonth)}</h2>
                            <small>Next month projection</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-info">
                        <div className="card-body">
                            <h6 className="card-title">Market Trend</h6>
                            <h2 className="card-text">
                                {getTrendIcon()} {forecast.trend.toUpperCase()}
                            </h2>
                            <small>Based on last 3 months</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h6 className="card-title">Confidence Level</h6>
                            <h2 className="card-text">{forecast.confidence}%</h2>
                            <small>Forecast accuracy</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">🏆 Top Performing Products</h5>
                </div>
                <div className="card-body">
                    {forecast.topProducts.length === 0 ? (
                        <p className="text-muted">No sales data available yet.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Units Sold</th>
                                    <th>Performance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {forecast.topProducts.map((product, index) => {
                                    const maxQty = forecast.topProducts[0]?.quantity || 1
                                    const percentage = (product.quantity / maxQty) * 100
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                            </td>
                                            <td><strong>{product.name}</strong></td>
                                            <td>{product.quantity}</td>
                                            <td>
                                                <div className="progress" style={{ height: '20px' }}>
                                                    <div
                                                        className="progress-bar bg-primary"
                                                        style={{ width: `${percentage}%` }}
                                                    >
                                                        {percentage.toFixed(0)}%
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary me-2">Home</Link>
                <Link to="/analytics" className="btn btn-primary">Analytics</Link>
            </div>
        </div>
    )
}

export default Forecasting