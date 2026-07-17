import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaBuilding,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaStar,
    FaUser  // ✅ Added
} from 'react-icons/fa'
import { toast } from 'react-toastify'

const SuppliersPage = () => {
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Load suppliers from localStorage (or API)
    useEffect(() => {
        loadSuppliers()
    }, [])

    const loadSuppliers = () => {
        const saved = localStorage.getItem('suppliers')
        if (saved) {
            setSuppliers(JSON.parse(saved))
        } else {
            // Default suppliers
            const defaultSuppliers = [
                {
                    id: 1,
                    name: 'Apple Inc.',
                    contact: 'John Doe',
                    email: 'supplier@apple.com',
                    phone: '+1-800-555-1234',
                    address: '1 Apple Park Way, Cupertino, CA 95014',
                    rating: 5,
                    products: ['iPhone 15 Pro', 'MacBook Air', 'iPad Pro'],
                    notes: 'Premium supplier for Apple products'
                },
                {
                    id: 2,
                    name: 'Dell Technologies',
                    contact: 'Jane Smith',
                    email: 'supplier@dell.com',
                    phone: '+1-800-555-5678',
                    address: '1 Dell Way, Round Rock, TX 78682',
                    rating: 4,
                    products: ['Dell XPS 15', 'Dell Monitor', 'Dell Keyboard'],
                    notes: 'Reliable supplier for business laptops'
                },
                {
                    id: 3,
                    name: 'Samsung Electronics',
                    contact: 'Bob Johnson',
                    email: 'supplier@samsung.com',
                    phone: '+1-800-555-9012',
                    address: '85 Challenger Rd, Ridgefield Park, NJ 07660',
                    rating: 4,
                    products: ['Samsung Galaxy S24', 'Samsung TV', 'Samsung Monitor'],
                    notes: 'Leading supplier for consumer electronics'
                },
                {
                    id: 4,
                    name: 'Sony Corporation',
                    contact: 'Alice Brown',
                    email: 'supplier@sony.com',
                    phone: '+1-800-555-3456',
                    address: '550 Madison Ave, New York, NY 10022',
                    rating: 5,
                    products: ['Sony WH-1000XM5', 'Sony TV', 'Sony PlayStation'],
                    notes: 'Premium audio and entertainment products'
                }
            ]
            setSuppliers(defaultSuppliers)
            localStorage.setItem('suppliers', JSON.stringify(defaultSuppliers))
        }
        setLoading(false)
    }

    const saveSuppliers = (newSuppliers) => {
        setSuppliers(newSuppliers)
        localStorage.setItem('suppliers', JSON.stringify(newSuppliers))
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            const updated = suppliers.filter(s => s.id !== id)
            saveSuppliers(updated)
            toast.success('Supplier deleted successfully!')
        }
    }

    const handleSave = (data) => {
        if (editingSupplier) {
            // Edit existing
            const updated = suppliers.map(s =>
                s.id === editingSupplier.id ? { ...s, ...data } : s
            )
            saveSuppliers(updated)
            toast.success('Supplier updated successfully!')
        } else {
            // Add new
            const newSupplier = {
                id: Date.now(),
                ...data,
                rating: data.rating || 3,
                products: data.products ? data.products.split(',').map(p => p.trim()) : []
            }
            saveSuppliers([...suppliers, newSupplier])
            toast.success('Supplier added successfully!')
        }
        setShowModal(false)
        setEditingSupplier(null)
    }

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Render stars
    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
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
                    <FaBuilding className="me-2" />
                    Suppliers
                    <span className="badge bg-secondary ms-2">{suppliers.length}</span>
                </h2>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '250px' }}
                    />
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setEditingSupplier(null)
                            setShowModal(true)
                        }}
                    >
                        <FaPlus className="me-2" />
                        Add Supplier
                    </button>
                </div>
            </div>

            {/* Supplier Cards */}
            <div className="row">
                {filteredSuppliers.map((supplier) => (
                    <div className="col-md-4 mb-4" key={supplier.id}>
                        <div className="card shadow h-100">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">{supplier.name}</h5>
                                    <span className="badge bg-primary">{renderStars(supplier.rating)}</span>
                                </div>
                                <p className="text-muted small">{supplier.notes}</p>
                                <hr />
                                <div className="mb-2">
                                    <FaUser className="me-2 text-primary" />
                                    <strong>{supplier.contact}</strong>
                                </div>
                                <div className="mb-2">
                                    <FaEnvelope className="me-2 text-primary" />
                                    <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                                </div>
                                <div className="mb-2">
                                    <FaPhone className="me-2 text-primary" />
                                    <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                                </div>
                                <div className="mb-2">
                                    <FaMapMarkerAlt className="me-2 text-primary" />
                                    <small>{supplier.address}</small>
                                </div>
                                {supplier.products && supplier.products.length > 0 && (
                                    <div className="mt-2">
                                        <small className="text-muted">Products:</small>
                                        <div>
                                            {supplier.products.map((p, i) => (
                                                <span key={i} className="badge bg-info me-1">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-transparent">
                                <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => {
                                        setEditingSupplier(supplier)
                                        setShowModal(true)
                                    }}
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(supplier.id)}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary me-2">Home</Link>
                <Link to="/purchase" className="btn btn-warning">Purchase</Link>
            </div>

            {/* Add/Edit Supplier Modal */}
            {showModal && (
                <SupplierModal
                    supplier={editingSupplier}
                    onSave={handleSave}
                    onClose={() => {
                        setShowModal(false)
                        setEditingSupplier(null)
                    }}
                />
            )}
        </div>
    )
}

// Supplier Modal Component
const SupplierModal = ({ supplier, onSave, onClose }) => {
    const [formData, setFormData] = useState(
        supplier || {
            name: '',
            contact: '',
            email: '',
            phone: '',
            address: '',
            rating: 3,
            products: '',
            notes: ''
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {supplier ? 'Edit Supplier' : 'Add Supplier'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Supplier Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Contact Person *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone *</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Rating</label>
                                    <select
                                        className="form-select"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                        <option value="4">⭐⭐⭐⭐ (Good)</option>
                                        <option value="3">⭐⭐⭐ (Average)</option>
                                        <option value="2">⭐⭐ (Poor)</option>
                                        <option value="1">⭐ (Very Poor)</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Products (comma separated)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.products}
                                        onChange={(e) => setFormData({...formData, products: e.target.value})}
                                        placeholder="iPhone 15 Pro, MacBook Air"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">
                                    {supplier ? 'Update' : 'Add'} Supplier
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuppliersPage