import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    FaUser,
    FaSignOutAlt,
    FaSignInAlt,
    FaUserPlus,
    FaChartLine,
    FaUsers,
    FaUpload,
    FaBox,
    FaShoppingCart,
    FaDollarSign,
    FaHome,
    FaCamera  // ✅ Make sure this is imported
} from 'react-icons/fa'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)

    useEffect(() => {
        checkAuthStatus()
    }, [location])

    const checkAuthStatus = () => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
        setIsLoggedIn(loggedIn)
        if (loggedIn) {
            const userData = localStorage.getItem('user')
            if (userData) {
                try {
                    setUser(JSON.parse(userData))
                } catch (e) {
                    console.error('Error parsing user data:', e)
                }
            }
        }
    }

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            setIsLoggedIn(false)
            setUser(null)
            setDropdownOpen(false)
            setMoreDropdownOpen(false)
            navigate('/login')
        }
    }

    // ✅ Scan button handler
    const handleScanClick = () => {
        console.log('📷 Scan button clicked from Navbar')
        window.dispatchEvent(new CustomEvent('openBarcodeScanner'))
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    📦 Smart Inventory and Stock Management
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <FaHome className="me-1" />
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/analytics">
                                <FaChartLine className="me-1" />
                                Analytics
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">
                                <FaBox className="me-1" />
                                Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/purchase">
                                <FaShoppingCart className="me-1" />
                                Purchase
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales">
                                <FaDollarSign className="me-1" />
                                Sales
                            </Link>
                        </li>

                        {/* ✅ Scan Button */}
                        <li className="nav-item">
                            <button
                                className="nav-link"
                                onClick={handleScanClick}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Scan Barcode"
                            >
                                <FaCamera className="me-1" />
                                Scan
                            </button>
                        </li>

                        {/* More Dropdown */}
                        <li className="nav-item dropdown" style={{ position: 'relative' }}>
                            <button
                                className="nav-link dropdown-toggle"
                                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                                style={{
                                    color: 'white',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                More
                            </button>
                            {moreDropdownOpen && (
                                <ul
                                    className="dropdown-menu show"
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '100%',
                                        display: 'block',
                                        minWidth: '200px',
                                        padding: '8px 0',
                                        zIndex: 1000
                                    }}
                                >
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/forecasting"
                                            onClick={() => setMoreDropdownOpen(false)}
                                        >
                                            <FaChartLine className="me-2" /> Forecasting
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/customers"
                                            onClick={() => setMoreDropdownOpen(false)}
                                        >
                                            <FaUsers className="me-2" /> Customers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/bulk-import"
                                            onClick={() => setMoreDropdownOpen(false)}
                                        >
                                            <FaUpload className="me-2" /> Bulk Import
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <li className="nav-item dropdown" style={{ position: 'relative' }}>
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{
                                        color: 'white',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaUser className="me-1" />
                                    {user?.name || 'Admin'}
                                </button>
                                {dropdownOpen && (
                                    <ul
                                        className="dropdown-menu show"
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '100%',
                                            display: 'block',
                                            minWidth: '200px',
                                            padding: '8px 0',
                                            zIndex: 1000
                                        }}
                                    >
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <FaUser className="me-2" /> Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to="/analytics"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <FaChartLine className="me-2" /> Analytics
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                <FaSignOutAlt className="me-2" /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <FaSignInAlt className="me-1" /> Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <FaUserPlus className="me-1" /> Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {(dropdownOpen || moreDropdownOpen) && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => {
                        setDropdownOpen(false)
                        setMoreDropdownOpen(false)
                    }}
                ></div>
            )}
        </nav>
    )
}

export default Navbar