import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSave, FaBell, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { productApi } from '../services/api'
import { sendLowStockAlert } from '../services/emailService'

const ReorderSettings = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [reorderSettings, setReorderSettings] = useState({})
    const [autoReorder, setAutoReorder] = useState(true)
    const [emailAlerts, setEmailAlerts] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await productApi.getAll()
            setProducts(response.data)

            const savedSettings = localStorage.getItem('reorderSettings')
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings)
                setReorderSettings(parsed)
                if (parsed.autoReorder !== undefined) {
                    setAutoReorder(parsed.autoReorder)
                }
                if (parsed.emailAlerts !== undefined) {
                    setEmailAlerts(parsed.emailAlerts)
                }
            } else {
                const defaultSettings = {}
                response.data.forEach(p => {
                    const stock = p.stock || p.stockQuantity || 0
                    defaultSettings[p.id || p.productId] = Math.max(5, Math.ceil(stock * 0.2))
                })
                defaultSettings.autoReorder = true
                defaultSettings.emailAlerts = true
                setReorderSettings(defaultSettings)
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load data')
            setLoading(false)
        }
    }

    const handleReorderChange = (productId, value) => {
        setReorderSettings({
            ...reorderSettings,
            [productId]: parseInt(value) || 0
        })
    }

    const saveSettings = () => {
        const settingsToSave = {
            ...reorderSettings,
            autoReorder: autoReorder,
            emailAlerts: emailAlerts
        }
        localStorage.setItem('reorderSettings', JSON.stringify(settingsToSave))
        toast.success('✅ Reorder settings saved successfully!')
    }

    const getStockStatus = (product) => {
        const stock = product.stock || product.stockQuantity || 0
        const reorderPoint = reorderSettings[product.id || product.productId] || 0

        if (stock === 0) return { status: 'Out of Stock', color: 'danger', icon: '🔴' }
        if (stock <= reorderPoint) return { status: 'Reorder Needed', color: 'warning', icon: '⚠️' }
        if (stock <= reorderPoint * 2) return { status: 'Low Stock', color: 'info', icon: '📦' }
        return { status: 'In Stock', color: 'success', icon: '✅' }
    }

    const getRecommendedOrder = (product) => {
        const stock = product.stock || product.stockQuantity || 0
        const reorderPoint = reorderSettings[product.id || product.productId] || 0
        if (stock <= reorderPoint) {
            return Math.max(10, reorderPoint * 2 - stock)
        }
        return 0
    }

    // ✅ Send test email alert
    const sendTestEmail = async () => {
        // Find a product that needs reorder
        const product = products.find(p => {
            const stock = p.stock || p.stockQuantity || 0
            const reorderPoint = reorderSettings[p.id || p.productId] || 0
            return stock <= reorderPoint && stock > 0
        })

        if (product) {
            const stock = product.stock || product.stockQuantity || 0
            await sendLowStockAlert(product, stock)
            toast.info('📧 Test email triggered! Check console for details.')
        } else {
            // Send test with first product
            if (products.length > 0) {
                const testProduct = products[0]
                const stock = testProduct.stock || testProduct.stockQuantity || 0
                await sendLowStockAlert(testProduct, stock || 5)
                toast.info('📧 Test email sent for: ' + (testProduct.name || testProduct.productName))
            } else {
                toast.warning('No products found to test email')
            }
        }
    }

    // ✅ Check and send alerts for all products that need reorder
    const checkAllProducts = async () => {
        let alertCount = 0
        for (const product of products) {
            const stock = product.stock || product.stockQuantity || 0
            const reorderPoint = reorderSettings[product.id || product.productId] || 0
            if (stock <= reorderPoint && stock > 0 && emailAlerts) {
                await sendLowStockAlert(product, stock)
                alertCount++
            }
        }
        if (alertCount > 0) {
            toast.success(`📧 ${alertCount} email alerts sent!`)
        } else {
            toast.info('No products need reordering')
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
                    <FaBell className="me-2" />
                    Reorder Settings
                </h2>
                <div className="d-flex gap-2 flex-wrap">
                    {/* ✅ Test Email Button */}
                    <button
                        className="btn btn-outline-info"
                        onClick={sendTestEmail}
                        title="Send test email alert"
                    >
                        <FaEnvelope className="me-2" />
                        Test Email
                    </button>

                    {/* ✅ Check All Button */}
                    <button
                        className="btn btn-outline-warning"
                        onClick={checkAllProducts}
                        title="Check all products and send alerts"
                    >
                        <FaBell className="me-2" />
                        Check All
                    </button>

                    <button className="btn btn-success" onClick={saveSettings}>
                        <FaSave className="me-2" />
                        Save Settings
                    </button>
                    <Link to="/" className="btn btn-secondary">
                        ← Back
                    </Link>
                </div>
            </div>

            <div className="alert alert-info">
                <strong>💡 How it works:</strong>
                <br />
                When stock falls to or below the reorder point, the system will alert you.
                The recommended order quantity is calculated automatically.
                {emailAlerts && (
                    <span className="text-success"> 📧 Email alerts are enabled.</span>
                )}
            </div>

            <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
                    <h5 className="mb-0">Product Reorder Points</h5>
                    <div className="d-flex gap-3 flex-wrap">
                        {/* Auto Reorder Toggle */}
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="autoReorder"
                                checked={autoReorder}
                                onChange={(e) => setAutoReorder(e.target.checked)}
                            />
                            <label className="form-check-label text-white" htmlFor="autoReorder">
                                Auto Reorder
                            </label>
                        </div>
                        {/* Email Alerts Toggle */}
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="emailAlerts"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                            />
                            <label className="form-check-label text-white" htmlFor="emailAlerts">
                                📧 Email Alerts
                            </label>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Product</th>
                                <th>Current Stock</th>
                                <th>Reorder Point</th>
                                <th>Status</th>
                                <th>Recommended Order</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => {
                                const stock = product.stock || product.stockQuantity || 0
                                const reorderPoint = reorderSettings[product.id || product.productId] || 0
                                const status = getStockStatus(product)
                                const recommended = getRecommendedOrder(product)

                                return (
                                    <tr key={product.id || product.productId}>
                                        <td>
                                            <strong>{product.name || product.productName}</strong>
                                            {product.brand && (
                                                <small className="text-muted d-block">
                                                    {product.brand}
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                                <span className={`badge bg-${stock === 0 ? 'danger' : 'primary'}`}>
                                                    {stock}
                                                </span>
                                        </td>
                                        <td style={{ minWidth: '120px' }}>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={reorderPoint}
                                                onChange={(e) => handleReorderChange(
                                                    product.id || product.productId,
                                                    e.target.value
                                                )}
                                                min="0"
                                                style={{ width: '100px' }}
                                            />
                                        </td>
                                        <td>
                                                <span className={`badge bg-${status.color}`}>
                                                    {status.icon} {status.status}
                                                </span>
                                            {status.status === 'Reorder Needed' && emailAlerts && (
                                                <small className="d-block text-muted">
                                                    📧 Alert will be sent
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            {recommended > 0 ? (
                                                <span className="text-warning">
                                                        📦 Order {recommended} units
                                                    </span>
                                            ) : (
                                                <span className="text-success">✅ Stock is healthy</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <h6>In Stock</h6>
                            <h3>
                                {products.filter(p => {
                                    const stock = p.stock || p.stockQuantity || 0
                                    const reorderPoint = reorderSettings[p.id || p.productId] || 0
                                    return stock > reorderPoint * 2
                                }).length}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <h6>Low Stock</h6>
                            <h3>
                                {products.filter(p => {
                                    const stock = p.stock || p.stockQuantity || 0
                                    const reorderPoint = reorderSettings[p.id || p.productId] || 0
                                    return stock <= reorderPoint * 2 && stock > reorderPoint
                                }).length}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <h6>Reorder Needed</h6>
                            <h3>
                                {products.filter(p => {
                                    const stock = p.stock || p.stockQuantity || 0
                                    const reorderPoint = reorderSettings[p.id || p.productId] || 0
                                    return stock <= reorderPoint && stock > 0
                                }).length}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white">
                        <div className="card-body text-center">
                            <h6>Out of Stock</h6>
                            <h3>
                                {products.filter(p => {
                                    const stock = p.stock || p.stockQuantity || 0
                                    return stock === 0
                                }).length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button className="btn btn-success btn-lg" onClick={saveSettings}>
                    <FaSave className="me-2" />
                    Save All Settings
                </button>
            </div>
        </div>
    )
}

export default ReorderSettings