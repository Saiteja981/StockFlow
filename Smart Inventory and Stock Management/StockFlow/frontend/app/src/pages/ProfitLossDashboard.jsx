import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FaDollarSign, FaChartLine, FaArrowUp, FaArrowDown,
    FaFileExport, FaCalendarAlt, FaBox, FaShoppingCart
} from 'react-icons/fa'
import { salesApi, purchaseApi, productApi } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency, formatDate } from '../utils/currencyUtils'
import ExportButton from '../components/reports/ExportButton'

const ProfitLossDashboard = () => {
    const { currency } = useCurrency()
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('month')
    const [data, setData] = useState({
        revenue: 0,
        costOfGoodsSold: 0,
        grossProfit: 0,
        grossMargin: 0,
        totalSales: 0,
        totalPurchases: 0,
        netProfit: 0,
        netMargin: 0,
        dailyData: [],
        monthlyData: [],
        topProducts: [],
        profitTrend: 'up'
    })

    useEffect(() => {
        fetchData()
    }, [period])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [salesRes, purchasesRes, productsRes] = await Promise.all([
                salesApi.getAll(),
                purchaseApi.getAll(),
                productApi.getAll()
            ])

            const sales = salesRes.data
            const purchases = purchasesRes.data
            const products = productsRes.data

            const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
            const totalCOGS = purchases.reduce((sum, p) => sum + (p.totalCost || 0), 0)

            const grossProfit = totalRevenue - totalCOGS
            const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

            const netProfit = grossProfit
            const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

            const dailyData = getDailyData(sales)
            const topProducts = getTopProducts(sales)
            const profitTrend = netProfit >= 0 ? 'up' : 'down'

            setData({
                revenue: totalRevenue,
                costOfGoodsSold: totalCOGS,
                grossProfit,
                grossMargin,
                totalSales: sales.length,
                totalPurchases: purchases.length,
                netProfit,
                netMargin,
                dailyData,
                monthlyData: dailyData.slice(-6),
                topProducts,
                profitTrend
            })
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    const getDailyData = (sales) => {
        const daily = {}
        sales.forEach(s => {
            const date = new Date(s.salesDate).toLocaleDateString()
            daily[date] = (daily[date] || 0) + (s.totalAmount || 0)
        })
        const sorted = Object.keys(daily).sort()
        return sorted.map(d => ({
            date: d,
            revenue: daily[d]
        }))
    }

    const getTopProducts = (sales) => {
        const productMap = {}
        sales.forEach(s => {
            const name = s.productName || 'Unknown'
            if (!productMap[name]) {
                productMap[name] = { name, revenue: 0, quantity: 0 }
            }
            productMap[name].revenue += (s.totalAmount || 0)
            productMap[name].quantity += (s.quantitySold || 0)
        })
        return Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
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
                    Profit & Loss Dashboard
                </h2>
                <div className="d-flex gap-2">
                    <div className="btn-group">
                        <button
                            className={`btn btn-outline-primary ${period === 'month' ? 'active' : ''}`}
                            onClick={() => setPeriod('month')}
                        >
                            Month
                        </button>
                        <button
                            className={`btn btn-outline-primary ${period === 'quarter' ? 'active' : ''}`}
                            onClick={() => setPeriod('quarter')}
                        >
                            Quarter
                        </button>
                        <button
                            className={`btn btn-outline-primary ${period === 'year' ? 'active' : ''}`}
                            onClick={() => setPeriod('year')}
                        >
                            Year
                        </button>
                    </div>
                    <ExportButton
                        data={data.dailyData}
                        filename="profit-loss-report"
                        headers={['date', 'revenue', 'profit']}
                    />
                    <Link to="/analytics" className="btn btn-secondary">
                        ← Back
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h6 className="card-title">Total Revenue</h6>
                            <h2 className="card-text">{formatCurrency(data.revenue, currency)}</h2>
                            <small className="text-light">Total sales</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-secondary">
                        <div className="card-body">
                            <h6 className="card-title">COGS</h6>
                            <h2 className="card-text">{formatCurrency(data.costOfGoodsSold, currency)}</h2>
                            <small className="text-light">Cost of goods sold</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className={`card text-white ${data.grossProfit >= 0 ? 'bg-success' : 'bg-danger'}`}>
                        <div className="card-body">
                            <h6 className="card-title">Gross Profit</h6>
                            <h2 className="card-text">{formatCurrency(data.grossProfit, currency)}</h2>
                            <small className="text-light">Margin: {data.grossMargin.toFixed(1)}%</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className={`card text-white ${data.netProfit >= 0 ? 'bg-success' : 'bg-danger'}`}>
                        <div className="card-body">
                            <h6 className="card-title">Net Profit</h6>
                            <h2 className="card-text">{formatCurrency(data.netProfit, currency)}</h2>
                            <small className="text-light">Margin: {data.netMargin.toFixed(1)}%</small>
                            <span className="ms-2">
                                {data.profitTrend === 'up' ?
                                    <FaArrowUp className="text-light" /> :
                                    <FaArrowDown className="text-light" />
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <h6 className="text-info">Total Sales</h6>
                            <h3>{data.totalSales}</h3>
                            <small>📈 Transactions</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <h6 className="text-warning">Total Purchases</h6>
                            <h3>{data.totalPurchases}</h3>
                            <small>📥 Orders</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <h6 className="text-success">Avg Order Value</h6>
                            <h3>{data.totalSales > 0 ? formatCurrency(data.revenue / data.totalSales, currency) : formatCurrency(0, currency)}</h3>
                            <small>💰 Per transaction</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-primary">
                        <div className="card-body text-center">
                            <h6 className="text-primary">Profit Ratio</h6>
                            <h3>{(data.revenue > 0 ? (data.netProfit / data.revenue * 100) : 0).toFixed(1)}%</h3>
                            <small>📊 Net margin</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="card shadow-sm">
                <div className="card-header bg-white">
                    <h5 className="mb-0">🏆 Top Products by Revenue</h5>
                </div>
                <div className="card-body">
                    {data.topProducts.length === 0 ? (
                        <p className="text-muted">No product data available</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Revenue</th>
                                    <th>Quantity Sold</th>
                                    <th>Avg Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.topProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</td>
                                        <td><strong>{product.name}</strong></td>
                                        <td className="text-success">{formatCurrency(product.revenue, currency)}</td>
                                        <td>{product.quantity}</td>
                                        <td>{formatCurrency(product.revenue / product.quantity, currency)}</td>
                                    </tr>
                                ))}
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

export default ProfitLossDashboard