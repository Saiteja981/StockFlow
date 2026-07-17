import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { salesApi, productApi } from '../services/api'

const SalesPage = () => {
    const [sales, setSales] = useState({
        productId: '',
        customerName: '',
        quantitySold: '',
        sellingPrice: '',
        salesDate: new Date().toISOString().split('T')[0]
    })
    const [products, setProducts] = useState([])
    const [salesList, setSalesList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchProducts()
        fetchSales()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await productApi.getAll()
            setProducts(response.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const fetchSales = async () => {
        try {
            const response = await salesApi.getAll()
            setSalesList(response.data)
            console.log('📊 Sales data:', response.data) // Debug: Check totalAmount
        } catch (error) {
            console.error('Error fetching sales:', error)
        }
    }

    // ✅ Handle product selection - auto-fill selling price
    const handleProductChange = (e) => {
        const productId = e.target.value
        const selectedProduct = products.find(p => (p.id || p.productId) == productId)

        if (selectedProduct) {
            setSales({
                ...sales,
                productId: productId,
                sellingPrice: selectedProduct.sellingPrice || 0
            })
        } else {
            setSales({
                ...sales,
                productId: productId,
                sellingPrice: ''
            })
        }
    }

    const handleChange = (e) => {
        setSales({
            ...sales,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const quantity = parseInt(sales.quantitySold)
            const price = parseFloat(sales.sellingPrice)

            await salesApi.create({
                productId: parseInt(sales.productId),
                customerName: sales.customerName,
                quantitySold: quantity,
                sellingPrice: price,
                salesDate: sales.salesDate
                // ✅ totalAmount is calculated in backend
            })

            await fetchSales() // Refresh the list
            setSales({
                productId: '',
                customerName: '',
                quantitySold: '',
                sellingPrice: '',
                salesDate: new Date().toISOString().split('T')[0]
            })
            alert('✅ Sales saved successfully!')
        } catch (error) {
            alert('❌ Failed to save sales')
        } finally {
            setLoading(false)
        }
    }

    // ✅ Helper to get product name
    const getProductName = (id) => {
        const product = products.find(p => (p.id || p.productId) == id)
        return product ? (product.name || product.productName) : 'N/A'
    }

    // ✅ Get available stock
    const getAvailableStock = () => {
        const product = products.find(p => (p.id || p.productId) == sales.productId)
        return product ? (product.stock || product.stockQuantity || 0) : 0
    }

    return (
        <>
            <div className="card shadow">
                <div className="card-header bg-danger text-white">
                    <h3 className="text-center">Sales Record</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label">Select Product</label>
                                <select
                                    className="form-select"
                                    name="productId"
                                    value={sales.productId}
                                    onChange={handleProductChange}
                                    required
                                >
                                    <option value="">-- Select Product --</option>
                                    {products.map((p) => (
                                        <option key={p.id || p.productId} value={p.id || p.productId}>
                                            {p.name || p.productName}
                                            (Stock: {p.stock || p.stockQuantity || 0})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Customer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="customerName"
                                    value={sales.customerName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label">Quantity Sold</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantitySold"
                                    value={sales.quantitySold}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max={getAvailableStock()}
                                />
                                {sales.productId && (
                                    <small className="text-muted">
                                        Available: {getAvailableStock()} units
                                    </small>
                                )}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Selling Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="sellingPrice"
                                    value={sales.sellingPrice}
                                    onChange={handleChange}
                                    required
                                    readOnly={!!sales.productId}
                                    style={{ backgroundColor: sales.productId ? '#e9ecef' : 'white' }}
                                />
                                {sales.productId && (
                                    <small className="text-muted">
                                        💡 Auto-filled from product database
                                    </small>
                                )}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Sales Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="salesDate"
                                    value={sales.salesDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Sales'}
                            </button>
                            <Link to="/products" className="btn btn-primary ms-2">
                                Products
                            </Link>
                            <Link to="/" className="btn btn-secondary ms-2">
                                Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <br />

            <div className="card shadow">
                <div className="card-header bg-dark text-white">
                    <h4>Sales History</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-danger">
                            <tr>
                                <th>Sales ID</th>
                                <th>Product Name</th>
                                <th>Customer</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total Amount</th>
                                <th>Sales Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {salesList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        No sales recorded yet
                                    </td>
                                </tr>
                            ) : (
                                salesList.map((s) => {
                                    // ✅ Calculate total if not present
                                    const total = s.totalAmount || (s.quantitySold * s.sellingPrice)
                                    return (
                                        <tr key={s.id || s.salesId}>
                                            <td>#{s.id || s.salesId}</td>
                                            <td>{s.productName || getProductName(s.productId) || 'N/A'}</td>
                                            <td>{s.customerName}</td>
                                            <td>{s.quantitySold}</td>
                                            <td>${s.sellingPrice}</td>
                                            <td>
                                                <strong className="text-success">
                                                    ${total.toFixed(2)}
                                                </strong>
                                            </td>
                                            <td>{new Date(s.salesDate).toLocaleDateString()}</td>
                                        </tr>
                                    )
                                })
                            )}
                            </tbody>
                            {/* ✅ Total Summary Row */}
                            {salesList.length > 0 && (
                                <tfoot className="table-dark">
                                <tr>
                                    <td colSpan="3" className="text-end fw-bold">Total:</td>
                                    <td>
                                        {salesList.reduce((sum, s) => sum + (s.quantitySold || 0), 0)}
                                    </td>
                                    <td></td>
                                    <td className="fw-bold text-success">
                                        ${salesList.reduce((sum, s) => sum + (s.totalAmount || s.quantitySold * s.sellingPrice || 0), 0).toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalesPage