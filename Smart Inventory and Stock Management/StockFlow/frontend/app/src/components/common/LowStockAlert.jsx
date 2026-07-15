import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaExclamationTriangle, FaBox, FaTimes } from 'react-icons/fa'
import { productApi } from '../../services/api'

const LowStockAlert = ({ threshold = 10 }) => {
    const [lowStockItems, setLowStockItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        fetchLowStockItems()
    }, [])

    const fetchLowStockItems = async () => {
        try {
            const response = await productApi.getAll()
            const products = response.data
            const lowStock = products.filter(
                p => (p.stock || p.stockQuantity) <= threshold
            )
            setLowStockItems(lowStock)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching low stock items:', error)
            setLoading(false)
        }
    }

    if (loading || lowStockItems.length === 0 || !isVisible) {
        return null
    }

    return (
        <div className="alert alert-warning alert-dismissible fade show shadow-sm">
            <div className="d-flex align-items-center">
                <FaExclamationTriangle className="me-2" size={20} />
                <div>
                    <strong>Low Stock Alert!</strong>
                    <span className="ms-2">
                        {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} are running low on stock.
                    </span>
                </div>
                <Link to="/products" className="btn btn-warning btn-sm ms-3">
                    <FaBox className="me-1" />
                    View Products
                </Link>
                <button
                    type="button"
                    className="btn-close ms-auto"
                    onClick={() => setIsVisible(false)}
                ></button>
            </div>
            <div className="mt-2">
                <small>
                    {lowStockItems.slice(0, 5).map((item, index) => (
                        <span key={index} className="badge bg-warning text-dark me-1">
                            {item.name || item.productName} ({item.stock || item.stockQuantity})
                        </span>
                    ))}
                    {lowStockItems.length > 5 && (
                        <span className="badge bg-secondary">+{lowStockItems.length - 5} more</span>
                    )}
                </small>
            </div>
        </div>
    )
}

export default LowStockAlert