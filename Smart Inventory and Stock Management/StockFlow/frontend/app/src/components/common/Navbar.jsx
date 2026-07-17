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
    FaCamera,
    FaBell,
    FaFileInvoice,
    FaBuilding,
    FaCreditCard,
    FaShieldAlt  // ✅ Added for 2FA
} from 'react-icons/fa'

// ✅ Import Currency Selector
import CurrencySelector from './CurrencySelector'

// ✅ Permission functions
const hasPermission = (userRole, permission) => {
    if (userRole === 'Admin') return true

    if (userRole === 'Manager') {
        const managerPermissions = [
            'dashboard', 'analytics', 'products', 'purchase',
            'sales', 'stockReport', 'reorderSettings', 'suppliers'
        ]
        return managerPermissions.includes(permission)
    }

    if (userRole === 'User') {
        const userPermissions = ['dashboard', 'products', 'sales']
        return userPermissions.includes(permission)
    }

    return false
}

const getUserRole = () => {
    try {
        const userData = localStorage.getItem('user')
        if (userData) {
            const user = JSON.parse(userData)
            return user.role || 'User'
        }
    } catch (e) {
        console.error('Error getting user role:', e)
    }
    return 'User'
}

// ✅ Get role info for display
const getRoleInfo = (role) => {
    const roleInfo = {
        'Admin': { label: 'Admin', color: 'danger', icon: '👑' },
        'Manager': { label: 'Manager', color: 'warning', icon: '📋' },
        'User': { label: 'User', color: 'info', icon: '👤' }
    }
    return roleInfo[role] || roleInfo['User']
}

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [userRole, setUserRole] = useState('User')
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
                    const parsed = JSON.parse(userData)
                    setUser(parsed)
                    setUserRole(parsed.role || 'User')
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

    const handleScanClick = () => {
        console.log('📷 Scan button clicked from Navbar')
        window.dispatchEvent(new CustomEvent('openBarcodeScanner'))
    }

    // ✅ Check permissions
    const canViewAnalytics = hasPermission(userRole, 'analytics')
    const canViewPurchase = hasPermission(userRole, 'purchase')
    const canViewCustomers = hasPermission(userRole, 'customers')
    const canViewBulkImport = hasPermission(userRole, 'bulkImport')
    const canViewStockReport = hasPermission(userRole, 'stockReport')
    const canViewReorderSettings = hasPermission(userRole, 'reorderSettings')
    const canViewSuppliers = hasPermission(userRole, 'suppliers')
    const canViewPaymentGateway = hasPermission(userRole, 'paymentGateway')
    const canViewForecasting = hasPermission(userRole, 'forecasting')
    const canViewRealtimeDashboard = hasPermission(userRole, 'dashboard')
    const canViewProfitLoss = hasPermission(userRole, 'profitLoss')
    const canView2FA = hasPermission(userRole, '2fa')

    // ✅ Check if user has any "More" items
    const hasMoreItems = canViewForecasting || canViewCustomers || canViewBulkImport ||
        canViewSuppliers || canViewStockReport || canViewReorderSettings ||
        canViewPaymentGateway || canViewProfitLoss || canView2FA

    // ✅ Get role info
    const roleInfo = getRoleInfo(userRole)

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
                        {/* Dashboard - Everyone */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <FaHome className="me-1" />
                                Dashboard
                            </Link>
                        </li>

                        {/* Analytics - Admin & Manager only */}
                        {canViewAnalytics && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/analytics">
                                    <FaChartLine className="me-1" />
                                    Analytics
                                </Link>
                            </li>
                        )}

                        {/* Products - Everyone */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">
                                <FaBox className="me-1" />
                                Products
                            </Link>
                        </li>

                        {/* Purchase - Admin & Manager only */}
                        {canViewPurchase && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/purchase">
                                    <FaShoppingCart className="me-1" />
                                    Purchase
                                </Link>
                            </li>
                        )}

                        {/* Sales - Everyone */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales">
                                <FaDollarSign className="me-1" />
                                Sales
                            </Link>
                        </li>

                        {/* Scan - Everyone */}
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

                        {/* Live Dashboard - Admin & Manager only */}
                        {canViewRealtimeDashboard && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/realtime-dashboard">
                                    <FaBell className="me-1" />
                                    Live
                                </Link>
                            </li>
                        )}

                        {/* ✅ More Dropdown - Only show if there are items */}
                        {hasMoreItems && (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setMoreDropdownOpen(!moreDropdownOpen)
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
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
                                            minWidth: '220px',
                                            padding: '8px 0',
                                            zIndex: 1000,
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}
                                    >
                                        {canViewForecasting && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/forecasting"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaChartLine className="me-2" /> Forecasting
                                                </Link>
                                            </li>
                                        )}

                                        {canViewCustomers && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/customers"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaUsers className="me-2" /> Customers
                                                </Link>
                                            </li>
                                        )}

                                        {canViewBulkImport && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/bulk-import"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaUpload className="me-2" /> Bulk Import
                                                </Link>
                                            </li>
                                        )}

                                        {canViewSuppliers && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/suppliers"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaBuilding className="me-2" /> Suppliers
                                                </Link>
                                            </li>
                                        )}

                                        <li><hr className="dropdown-divider" /></li>

                                        {canViewStockReport && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/stock-report"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaBox className="me-2" /> Stock Report
                                                </Link>
                                            </li>
                                        )}

                                        {canViewReorderSettings && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/reorder-settings"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaBell className="me-2" /> Reorder Settings
                                                </Link>
                                            </li>
                                        )}

                                        {canViewPaymentGateway && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/payment-gateway"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaCreditCard className="me-2" /> Payment
                                                </Link>
                                            </li>
                                        )}

                                        {/* ✅ Profit & Loss - NEW */}
                                        {canViewProfitLoss && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/profit-loss"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaChartLine className="me-2" /> Profit & Loss
                                                </Link>
                                            </li>
                                        )}

                                        {/* ✅ 2FA - NEW */}
                                        {canView2FA && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/2fa"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaShieldAlt className="me-2" /> 2FA
                                                </Link>
                                            </li>
                                        )}

                                        <li><hr className="dropdown-divider" /></li>

                                        {canViewPaymentGateway && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/invoice/1"
                                                    onClick={() => setMoreDropdownOpen(false)}
                                                >
                                                    <FaFileInvoice className="me-2" /> Invoice
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {/* ✅ Currency Selector */}
                        <li className="nav-item me-2" style={{ display: 'flex', alignItems: 'center' }}>
                            <CurrencySelector />
                        </li>

                        {isLoggedIn ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setDropdownOpen(!dropdownOpen)
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaUser className="me-1" />
                                    {user?.name || 'User'} {roleInfo.icon} ({userRole})
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
                                            zIndex: 1000,
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
                                        {canViewAnalytics && (
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/analytics"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <FaChartLine className="me-2" /> Analytics
                                                </Link>
                                            </li>
                                        )}
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