import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa'
import { productApi } from '../../services/api'

const ReorderAlert = ({ threshold = 10 }) => {
    const [reorderItems, setReorderItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await productApi.getAll()
            const products = response.data
            // Items that need reorder (stock <= threshold)
            const needsReorder = products.filter(p => (p.stock || p.stockQuantity) <= threshold)
            setReorderItems(needsReorder)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    if (loading || reorderItems.length === 0) return null

    return (
        <div className="card border-warning mb-3">
            <div className="card-header bg-warning text-dark">
                <FaShoppingCart className="me-2" />
                <strong>🔄 Reorder Required</strong>
                <span className="badge bg-danger ms-2">{reorderItems.length} items</span>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-sm mb-0">
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Current Stock</th>
                            <th>Recommended Order</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reorderItems.slice(0, 5).map((item) => {
                            const stock = item.stock || item.stockQuantity || 0
                            const recommended = Math.max(20, stock * 2)
                            return (
                                <tr key={item.id || item.productId}>
                                    <td>{item.name || item.productName}</td>
                                    <td>
                                        <span className="badge bg-danger">{stock}</span>
                                    </td>
                                    <td>{recommended}</td>
                                    <td>
                                        <Link
                                            to={`/purchase`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Order Now
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                {reorderItems.length > 5 && (
                    <div className="text-center mt-2">
                        <small className="text-muted">
                            +{reorderItems.length - 5} more items need reorder
                        </small>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReorderAlert