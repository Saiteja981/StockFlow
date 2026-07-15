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
        } catch (error) {
            console.error('Error fetching sales:', error)
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
            await salesApi.create({
                productId: parseInt(sales.productId),
                customerName: sales.customerName,
                quantitySold: parseInt(sales.quantitySold),
                sellingPrice: parseFloat(sales.sellingPrice),
                salesDate: sales.salesDate
            })
            fetchSales()
            setSales({
                productId: '',
                customerName: '',
                quantitySold: '',
                sellingPrice: '',
                salesDate: new Date().toISOString().split('T')[0]
            })
            alert('Sales saved successfully!')
        } catch (error) {
            alert('Failed to save sales')
        } finally {
            setLoading(false)
        }
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
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Product --</option>
                                    {products.map((p) => (
                                        <option key={p.id || p.productId} value={p.id || p.productId}>
                                            {p.name || p.productName} (Stock: {p.stock || p.stockQuantity})
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
                                />
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
                                />
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
                                <th>Quantity Sold</th>
                                <th>Selling Price</th>
                                <th>Total Amount</th>
                                <th>Sales Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {salesList.map((s) => (
                                <tr key={s.id || s.salesId}>
                                    <td>{s.id || s.salesId}</td>
                                    <td>{s.productName || s.product?.name || 'N/A'}</td>
                                    <td>{s.customerName}</td>
                                    <td>{s.quantitySold}</td>
                                    <td>${s.sellingPrice}</td>
                                    <td>${s.totalAmount || (s.quantitySold * s.sellingPrice)}</td>
                                    <td>{new Date(s.salesDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalesPage