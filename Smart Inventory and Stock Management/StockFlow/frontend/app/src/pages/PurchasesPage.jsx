import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { purchaseApi, productApi } from '../services/api'

const PurchasesPage = () => {
  const [purchase, setPurchase] = useState({
    productId: '',
    quantity: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  })
  const [products, setProducts] = useState([])
  const [purchaseList, setPurchaseList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchPurchases()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll()
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchPurchases = async () => {
    try {
      const response = await purchaseApi.getAll()
      setPurchaseList(response.data)
    } catch (error) {
      console.error('Error fetching purchases:', error)
    }
  }

  const handleChange = (e) => {
    setPurchase({
      ...purchase,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await purchaseApi.create({
        productId: parseInt(purchase.productId),
        quantity: parseInt(purchase.quantity),
        purchasePrice: parseFloat(purchase.purchasePrice),
        purchaseDate: purchase.purchaseDate
      })
      fetchPurchases()
      setPurchase({
        productId: '',
        quantity: '',
        purchasePrice: '',
        purchaseDate: new Date().toISOString().split('T')[0]
      })
      alert('Purchase saved successfully!')
    } catch (error) {
      alert('Failed to save purchase')
    } finally {
      setLoading(false)
    }
  }

  return (
      <>
        <div className="card shadow">
          <div className="card-header bg-warning">
            <h3 className="text-center">Purchase Record</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Select Product</label>
                  <select
                      className="form-select"
                      name="productId"
                      value={purchase.productId}
                      onChange={handleChange}
                      required
                  >
                    <option value="">-- Select Product --</option>
                    {products.map((p) => (
                        <option key={p.id || p.productId} value={p.id || p.productId}>
                          {p.name || p.productName}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Quantity</label>
                  <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={purchase.quantity}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Purchase Price</label>
                  <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="purchasePrice"
                      value={purchase.purchasePrice}
                      onChange={handleChange}
                      required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Purchase Date</label>
                  <input
                      type="date"
                      className="form-control"
                      name="purchaseDate"
                      value={purchase.purchaseDate}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
              <br />
              <div className="text-center">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Purchase'}
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
            <h4>Purchase History</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-warning">
                <tr>
                  <th>Purchase ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Total Cost</th>
                  <th>Purchase Date</th>
                </tr>
                </thead>
                <tbody>
                {purchaseList.map((p) => (
                    <tr key={p.id || p.purchaseId}>
                      <td>{p.id || p.purchaseId}</td>
                      <td>{p.productName || p.product?.name || 'N/A'}</td>
                      <td>{p.quantity}</td>
                      <td>${p.purchasePrice}</td>
                      <td>${p.totalCost || (p.quantity * p.purchasePrice)}</td>
                      <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
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

export default PurchasesPage