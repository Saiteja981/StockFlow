import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { productApi } from '../../services/api'

const AddProduct = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        name: '',
        category: '',
        brand: '',
        purchasePrice: '',
        sellingPrice: '',
        stock: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await productApi.create({
                name: product.name,
                category: product.category,
                brand: product.brand,
                purchasePrice: parseFloat(product.purchasePrice),
                sellingPrice: parseFloat(product.sellingPrice),
                stock: parseInt(product.stock)
            })
            toast.success('✅ Product added successfully!')
            setTimeout(() => navigate('/products'), 1500)
        } catch (error) {
            toast.error('❌ Failed to add product')
            setLoading(false)
        }
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="text-center">Add Product</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={product.name}
                                        onChange={handleChange}
                                        placeholder="Enter Product Name"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="category"
                                        value={product.category}
                                        onChange={handleChange}
                                        placeholder="Enter Category"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Brand</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="brand"
                                        value={product.brand}
                                        onChange={handleChange}
                                        placeholder="Enter Brand"
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Purchase Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                name="purchasePrice"
                                                value={product.purchasePrice}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Selling Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                name="sellingPrice"
                                                value={product.sellingPrice}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        value={product.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Product'}
                                    </button>
                                    <Link to="/products" className="btn btn-secondary ms-2">
                                        View Products
                                    </Link>
                                    <Link to="/" className="btn btn-danger ms-2">
                                        Home
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProduct