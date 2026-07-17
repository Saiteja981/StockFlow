import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaBox, FaTrash, FaBarcode } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { productApi } from '../../services/api'
import SearchBar from '../common/SearchBar'
import ProductFilters from './ProductFilters'
import Pagination from '../common/Pagination'
import LowStockAlert from '../common/LowStockAlert'
import BarcodeGenerator from './BarcodeGenerator'
import BarcodeScanner from './BarcodeScanner'
import { useCurrency } from '../../context/CurrencyContext'
import { formatCurrency } from '../../utils/currencyUtils'
import 'react-toastify/dist/ReactToastify.css'

const ProductList = () => {
    const navigate = useNavigate()
    const { currency } = useCurrency() // ✅ Get current currency
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Search & Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        stockStatus: '',
        minPrice: '',
        maxPrice: ''
    })

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Barcode states
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showBarcodeGenerator, setShowBarcodeGenerator] = useState(false)
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

    // Extract unique categories and brands
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        applyFiltersAndSearch()
    }, [products, searchTerm, filters])

    // Listen for barcode scanner event from navbar
    useEffect(() => {
        const handleOpenScanner = () => {
            console.log('🔍 Barcode scanner triggered from navbar!')
            setShowBarcodeScanner(true)
        }

        window.addEventListener('openBarcodeScanner', handleOpenScanner)

        return () => {
            window.removeEventListener('openBarcodeScanner', handleOpenScanner)
        }
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await productApi.getAll()
            setProducts(response.data)
            setFilteredProducts(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Failed to load products')
            setLoading(false)
        }
    }

    const applyFiltersAndSearch = () => {
        let result = [...products]

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(p =>
                (p.name || p.productName || '').toLowerCase().includes(term) ||
                (p.category || '').toLowerCase().includes(term) ||
                (p.brand || '').toLowerCase().includes(term)
            )
        }

        if (filters.category) {
            result = result.filter(p => p.category === filters.category)
        }

        if (filters.brand) {
            result = result.filter(p => p.brand === filters.brand)
        }

        if (filters.stockStatus) {
            const stock = filters.stockStatus
            result = result.filter(p => {
                const qty = p.stock || p.stockQuantity || 0
                if (stock === 'in-stock') return qty > 10
                if (stock === 'low-stock') return qty > 0 && qty <= 10
                if (stock === 'out-of-stock') return qty === 0
                return true
            })
        }

        if (filters.minPrice) {
            result = result.filter(p => (p.sellingPrice || 0) >= parseFloat(filters.minPrice))
        }
        if (filters.maxPrice) {
            result = result.filter(p => (p.sellingPrice || 0) <= parseFloat(filters.maxPrice))
        }

        setFilteredProducts(result)
        setCurrentPage(1)
    }

    const handleDelete = async (id, name) => {
        const confirm = window.confirm(`Are you sure you want to delete "${name}"?`)
        if (confirm) {
            try {
                await productApi.delete(id)
                fetchProducts()
                toast.success(`"${name}" deleted successfully!`)
            } catch (error) {
                toast.error('Failed to delete product')
            }
        }
    }

    const clearFilters = () => {
        setFilters({
            category: '',
            brand: '',
            stockStatus: '',
            minPrice: '',
            maxPrice: ''
        })
        setSearchTerm('')
    }

    const handleBarcodeScan = (barcode) => {
        console.log('📷 Barcode scanned:', barcode)

        const product = products.find(p =>
            String(p.id || p.productId) === String(barcode)
        )

        if (product) {
            const productId = product.id || product.productId
            toast.success(`✅ Found: ${product.name || product.productName}`)
            setShowBarcodeScanner(false)
            navigate(`/updateStock/${productId}`)
        } else {
            toast.error('❌ Product not found for this barcode')
        }
    }

    // ✅ Add Checkout handler
    const handleCheckout = (product) => {
        const price = product.sellingPrice || product.price || 0
        const name = product.name || product.productName || 'Product'

        navigate('/checkout', {
            state: {
                amount: price,
                currency: currency, // ✅ Pass currency to checkout
                items: [
                    {
                        name: name,
                        price: price,
                        quantity: 1
                    }
                ]
            }
        })
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

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
        <>
            <LowStockAlert threshold={10} />

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <h2>
                    <FaBox className="me-2" />
                    Products
                    <span className="badge bg-secondary ms-2">{filteredProducts.length}</span>
                </h2>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowBarcodeScanner(true)}
                        title="Scan Barcode"
                    >
                        <FaBarcode className="me-1" />
                        Scan
                    </button>
                    <Link to="/addProduct" className="btn btn-success">
                        <FaPlus className="me-1" />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onClearSearch={() => setSearchTerm('')}
                        placeholder="Search by name, category, or brand..."
                    />
                </div>
            </div>

            <ProductFilters
                categories={categories}
                brands={brands}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
            />

            {filteredProducts.length === 0 ? (
                <div className="alert alert-info">
                    No products found matching your criteria.
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Purchase Price</th>
                                <th>Selling Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentProducts.map((product) => {
                                const stock = product.stock || product.stockQuantity || 0
                                let status = 'In Stock'
                                let badgeClass = 'bg-success'
                                if (stock === 0) {
                                    status = 'Out of Stock'
                                    badgeClass = 'bg-danger'
                                } else if (stock <= 10) {
                                    status = 'Low Stock'
                                    badgeClass = 'bg-warning'
                                }

                                return (
                                    <tr key={product.id || product.productId}>
                                        <td>{product.id || product.productId}</td>
                                        <td>
                                            <strong>{product.name || product.productName}</strong>
                                        </td>
                                        <td>{product.category || 'N/A'}</td>
                                        <td>{product.brand || 'N/A'}</td>
                                        <td>
                                            {/* ✅ Format purchase price with currency */}
                                            {formatCurrency(product.purchasePrice || 0, currency)}
                                        </td>
                                        <td>
                                            {/* ✅ Format selling price with currency */}
                                            {formatCurrency(product.sellingPrice || 0, currency)}
                                        </td>
                                        <td>
                                                <span className={`badge ${badgeClass}`}>
                                                    {stock}
                                                </span>
                                        </td>
                                        <td>
                                                <span className={`badge ${badgeClass}`}>
                                                    {status}
                                                </span>
                                        </td>
                                        <td>
                                            {/* Buy Now Button */}
                                            <button
                                                className="btn btn-success btn-sm me-1"
                                                onClick={() => handleCheckout(product)}
                                                title="Buy Now"
                                            >
                                                💳 Buy
                                            </button>
                                            {/* Barcode Button */}
                                            <button
                                                className="btn btn-outline-primary btn-sm me-1"
                                                onClick={() => {
                                                    setSelectedProduct(product)
                                                    setShowBarcodeGenerator(true)
                                                }}
                                                title="Generate Barcode"
                                            >
                                                <FaBarcode />
                                            </button>
                                            {/* Update Stock Button */}
                                            <Link
                                                to={`/updateStock/${product.id || product.productId}`}
                                                className="btn btn-primary btn-sm me-1"
                                                title="Update Stock"
                                            >
                                                <FaBox />
                                            </Link>
                                            {/* Delete Button */}
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(
                                                    product.id || product.productId,
                                                    product.name || product.productName
                                                )}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredProducts.length}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </>
            )}

            <div className="text-center mt-3">
                <Link to="/" className="btn btn-secondary me-2">Home</Link>
                <Link to="/purchase" className="btn btn-warning me-2">Purchase</Link>
                <Link to="/sales" className="btn btn-danger">Sales</Link>
            </div>

            {/* Barcode Generator Modal */}
            {showBarcodeGenerator && selectedProduct && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <FaBarcode className="me-2" />
                                    Barcode Generator - {selectedProduct.name || selectedProduct.productName}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowBarcodeGenerator(false)
                                        setSelectedProduct(null)
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <BarcodeGenerator product={selectedProduct} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barcode Scanner Modal */}
            {showBarcodeScanner && (
                <BarcodeScanner
                    onScan={handleBarcodeScan}
                    onClose={() => setShowBarcodeScanner(false)}
                />
            )}
        </>
    )
}

export default ProductList