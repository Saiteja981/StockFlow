import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productApi } from '../../services/api'

const UpdateStock = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [stockQuantity, setStockQuantity] = useState('')
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const response = await productApi.getById(id)
            setProduct(response.data)
            setStockQuantity(response.data.stockQuantity || response.data.stock || '')
            setLoading(false)
        } catch (error) {
            alert('Product not found')
            navigate('/products')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdating(true)
        try {
            await productApi.updateStock(id, parseInt(stockQuantity))
            navigate('/products')
        } catch (error) {
            alert('Failed to update stock')
            setUpdating(false)
        }
    }

    if (loading) return <div className="text-center mt-5">Loading...</div>

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                        <h3 className="text-center">Update Product Stock</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={product.name || product.productName}
                                    readOnly
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={product.category}
                                    readOnly
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Brand</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={product.brand}
                                    readOnly
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Current Stock</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-success" disabled={updating}>
                                    {updating ? 'Updating...' : 'Update Stock'}
                                </button>
                                <Link to="/products" className="btn btn-secondary ms-2">
                                    Back
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateStock