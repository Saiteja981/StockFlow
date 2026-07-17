import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBox, FaDollarSign, FaArrowUp, FaArrowDown, FaFileExport } from 'react-icons/fa'
import { productApi } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency } from '../utils/currencyUtils'
import ExportButton from '../components/reports/ExportButton'

const StockReport = () => {
    const { currency } = useCurrency() // ✅ Get current currency
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStockValue: 0,
        totalPurchaseValue: 0,
        totalSellingValue: 0,
        potentialProfit: 0,
        lowStockCount: 0,
        outOfStockCount: 0
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await productApi.getAll()
            setProducts(response.data)
            calculateStats(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    const calculateStats = (products) => {
        let totalStockValue = 0
        let totalPurchaseValue = 0
        let totalSellingValue = 0
        let lowStockCount = 0
        let outOfStockCount = 0

        products.forEach(p => {
            const stock = p.stock || p.stockQuantity || 0
            const purchasePrice = p.purchasePrice || 0
            const sellingPrice = p.sellingPrice || 0

            totalStockValue += stock * purchasePrice
            totalPurchaseValue += stock * purchasePrice
            totalSellingValue += stock * sellingPrice

            if (stock === 0) outOfStockCount++
            else if (stock <= 10) lowStockCount++
        })

        setStats({
            totalProducts: products.length,
            totalStockValue,
            totalPurchaseValue,
            totalSellingValue,
            potentialProfit: totalSellingValue - totalPurchaseValue,
            lowStockCount,
            outOfStockCount
        })
    }

    const getStockStatus = (stock) => {
        if (stock === 0) return { status: 'Out of Stock', color: 'danger' }
        if (stock <= 10) return { status: 'Low Stock', color: 'warning' }
        return { status: 'In Stock', color: 'success' }
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
                    <FaBox className="me-2" />
                    Stock Value Report
                    <span className="badge bg-info ms-2">{currency}</span>
                </h2>
                <div className="d-flex gap-2">
                    <ExportButton
                        data={products}
                        filename="stock-report"
                        headers={['id', 'name', 'category', 'brand', 'purchasePrice', 'sellingPrice', 'stock', 'stockValue']}
                    />
                    <Link to="/" className="btn btn-secondary">
                        ← Back
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h6 className="card-title">Total Products</h6>
                            <h2 className="card-text">{stats.totalProducts}</h2>
                            <small>Items in inventory</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h6 className="card-title">Stock Value</h6>
                            {/* ✅ Format with currency */}
                            <h2 className="card-text">{formatCurrency(stats.totalStockValue, currency)}</h2>
                            <small>At purchase price</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-info">
                        <div className="card-body">
                            <h6 className="card-title">Potential Revenue</h6>
                            <h2 className="card-text">{formatCurrency(stats.totalSellingValue, currency)}</h2>
                            <small>At selling price</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <h6 className="card-title">Potential Profit</h6>
                            <h2 className="card-text">{formatCurrency(stats.potentialProfit, currency)}</h2>
                            <small>If all sold at selling price</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Status Cards */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <h6 className="text-success">In Stock</h6>
                            <h3>{stats.totalProducts - stats.lowStockCount - stats.outOfStockCount}</h3>
                            <small>Healthy stock</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <h6 className="text-warning">Low Stock</h6>
                            <h3>{stats.lowStockCount}</h3>
                            <small>Stock ≤ 10</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card border-danger">
                        <div className="card-body text-center">
                            <h6 className="text-danger">Out of Stock</h6>
                            <h3>{stats.outOfStockCount}</h3>
                            <small>No stock available</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="card shadow">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Product Stock Details</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Purchase Price</th>
                                <th>Selling Price</th>
                                <th>Stock</th>
                                <th>Stock Value</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => {
                                const stock = product.stock || product.stockQuantity || 0
                                const purchasePrice = product.purchasePrice || 0
                                const sellingPrice = product.sellingPrice || 0
                                const stockValue = stock * purchasePrice
                                const status = getStockStatus(stock)

                                return (
                                    <tr key={product.id || product.productId}>
                                        <td>
                                            <strong>{product.name || product.productName}</strong>
                                        </td>
                                        <td>{product.category || 'N/A'}</td>
                                        <td>{formatCurrency(purchasePrice, currency)}</td>
                                        <td>{formatCurrency(sellingPrice, currency)}</td>
                                        <td>
                                                <span className={`badge bg-${status.color}`}>
                                                    {stock}
                                                </span>
                                        </td>
                                        <td>{formatCurrency(stockValue, currency)}</td>
                                        <td>
                                                <span className={`badge bg-${status.color}`}>
                                                    {status.status}
                                                </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary me-2">Home</Link>
                <Link to="/products" className="btn btn-primary">Products</Link>
            </div>
        </div>
    )
}

export default StockReport