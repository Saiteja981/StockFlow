import React from 'react'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'

const SearchBar = ({
                       searchTerm,
                       onSearchChange,
                       onClearSearch,
                       placeholder = "Search products..."
                   }) => {
    return (
        <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-white">
                <FaSearch className="text-muted" />
            </span>
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ borderLeft: 'none' }}
            />
            {searchTerm && (
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={onClearSearch}
                >
                    <FaTimes />
                </button>
            )}
        </div>
    )
}

export default SearchBar