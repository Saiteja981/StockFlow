import React, { useState, useEffect } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'

const ProductFilters = ({
                            categories = [],
                            brands = [],
                            onFilterChange,
                            onClearFilters
                        }) => {
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        stockStatus: '',
        minPrice: '',
        maxPrice: ''
    })
    const [isOpen, setIsOpen] = useState(false)

    const handleChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value
        }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const clearFilters = () => {
        const emptyFilters = {
            category: '',
            brand: '',
            stockStatus: '',
            minPrice: '',
            maxPrice: ''
        }
        setFilters(emptyFilters)
        onClearFilters()
        setIsOpen(false)
    }

    const hasActiveFilters = Object.values(filters).some(val => val !== '')

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FaFilter className="me-2" />
                        Filters
                        {hasActiveFilters && (
                            <span className="badge bg-primary ms-2">
                                {Object.values(filters).filter(v => v !== '').length}
                            </span>
                        )}
                    </button>
                    {hasActiveFilters && (
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={clearFilters}
                        >
                            <FaTimes className="me-1" />
                            Clear All
                        </button>
                    )}
                </div>

                {isOpen && (
                    <div className="row mt-3">
                        <div className="col-md-3 mb-2">
                            <label className="form-label">Category</label>
                            <select
                                className="form-select form-select-sm"
                                name="category"
                                value={filters.category}
                                onChange={handleChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className="form-label">Brand</label>
                            <select
                                className="form-select form-select-sm"
                                name="brand"
                                value={filters.brand}
                                onChange={handleChange}
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className="form-label">Stock Status</label>
                            <select
                                className="form-select form-select-sm"
                                name="stockStatus"
                                value={filters.stockStatus}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className="form-label">Price Range</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    name="minPrice"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    name="maxPrice"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductFilters