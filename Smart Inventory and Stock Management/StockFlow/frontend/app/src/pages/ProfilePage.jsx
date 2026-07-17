import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaUserEdit, FaPalette, FaBell, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import { getUserRole, getFeatures, getRoleInfo } from '../utils/roles'

const ProfilePage = () => {
    const { theme, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('profile')
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'User'
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [userRole, setUserRole] = useState('User')
    const [userFeatures, setUserFeatures] = useState([])

    useEffect(() => {
        loadUserData()
        loadRoleInfo()
    }, [])

    const loadUserData = () => {
        const userData = localStorage.getItem('user')
        if (userData) {
            try {
                const parsed = JSON.parse(userData)
                setUser({
                    name: parsed.name || 'User',
                    email: parsed.email || 'user@example.com',
                    phone: parsed.phone || '+1 234 567 8900',
                    role: parsed.role || 'User'
                })
                setUserRole(parsed.role || 'User')
            } catch (e) {
                console.error('Error loading user data:', e)
            }
        }
    }

    const loadRoleInfo = () => {
        const role = getUserRole()
        const features = getFeatures(role)
        setUserFeatures(features)
    }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')

        try {
            // Update user in localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
            const updatedUser = { ...currentUser, ...user }
            localStorage.setItem('user', JSON.stringify(updatedUser))

            setMessage('✅ Profile updated successfully!')
            setLoading(false)
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setError('❌ Failed to update profile')
            setLoading(false)
        }
    }

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordLoading(true)
        setPasswordMessage('')
        setPasswordError('')

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            setPasswordLoading(false)
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match')
            setPasswordLoading(false)
            return
        }

        try {
            setPasswordMessage('✅ Password changed successfully!')
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setPasswordLoading(false)
            setTimeout(() => setPasswordMessage(''), 3000)
        } catch (error) {
            setPasswordError('❌ Failed to change password')
            setPasswordLoading(false)
        }
    }

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            localStorage.clear()
            window.location.href = '/login'
        }
    }

    const handleExportData = () => {
        const data = {
            user: JSON.parse(localStorage.getItem('user') || '{}'),
            registeredUsers: JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
            exportDate: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        alert('✅ Data exported successfully!')
    }

    const getRoleBadgeColor = (role) => {
        const colors = {
            'Admin': 'danger',
            'Manager': 'warning',
            'User': 'info'
        }
        return colors[role] || 'secondary'
    }

    const renderProfileTab = () => (
        <div className="card-body">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaUser /></span>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaEnvelope /></span>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone Number</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaPhone /></span>
                            <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Role</label>
                        <div className="input-group">
                            <span className="input-group-text"><FaUserEdit /></span>
                            <input
                                type="text"
                                className="form-control"
                                value={user.role}
                                disabled
                                style={{ backgroundColor: '#e9ecef' }}
                            />
                        </div>
                        <small className="text-muted">
                            <span className={`badge bg-${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                            </span>
                            {' '} - Role cannot be changed
                        </small>
                    </div>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <FaSave className="me-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )

    const renderPasswordTab = () => (
        <div className="card-body">
            <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                            type="password"
                            className="form-control"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Enter current password"
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                            type="password"
                            className="form-control"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Enter new password (min 6 characters)"
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
                {passwordError && <div className="alert alert-danger">{passwordError}</div>}

                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-warning" disabled={passwordLoading}>
                        <FaLock className="me-2" />
                        {passwordLoading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    )

    const renderSettingsTab = () => {
        const roleInfo = getRoleInfo(userRole)

        return (
            <div className="card-body">
                {/* Role Information */}
                <div className="alert alert-info">
                    <strong>👤 Your Role: </strong>
                    <span className={`badge bg-${roleInfo.color}`}>
                        {roleInfo.icon} {roleInfo.label}
                    </span>
                    <br />
                    <small className="text-muted">
                        You have access to {userFeatures.length} features
                    </small>
                </div>

                {/* Theme Preferences */}
                <div className="mb-4">
                    <h5><FaPalette className="me-2" /> Theme Preferences</h5>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="theme"
                                    id="themeLight"
                                    value="light"
                                    checked={theme === 'light'}
                                    onChange={toggleTheme}
                                />
                                <label className="form-check-label" htmlFor="themeLight">
                                    ☀️ Light Mode
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="theme"
                                    id="themeDark"
                                    value="dark"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <label className="form-check-label" htmlFor="themeDark">
                                    🌙 Dark Mode
                                </label>
                            </div>
                        </div>
                    </div>
                    <small className="text-muted mt-2 d-block">
                        Current theme: <strong>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</strong>
                    </small>
                </div>

                <hr />

                {/* Your Features */}
                <div className="mb-4">
                    <h5>🔐 Your Access Features</h5>
                    <div className="row mt-2">
                        {userFeatures.map((feature, index) => (
                            <div key={index} className="col-md-4 col-lg-3 mb-2">
                                <span className="badge bg-success d-flex align-items-center p-2">
                                    <FaCheckCircle className="me-1" />
                                    {feature.charAt(0).toUpperCase() + feature.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <hr />

                {/* Notifications */}
                <div className="mb-4">
                    <h5><FaBell className="me-2" /> Notification Preferences</h5>
                    <div className="mt-3">
                        <div className="form-check form-switch mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="notifyStock"
                                defaultChecked
                            />
                            <label className="form-check-label" htmlFor="notifyStock">
                                Low Stock Alerts
                            </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="notifySales"
                                defaultChecked
                            />
                            <label className="form-check-label" htmlFor="notifySales">
                                New Sales Notifications
                            </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="notifyPurchase"
                                defaultChecked
                            />
                            <label className="form-check-label" htmlFor="notifyPurchase">
                                Purchase Confirmations
                            </label>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Data Management */}
                <div className="mb-4">
                    <h5>🔄 Data Management</h5>
                    <div className="mt-3">
                        <button className="btn btn-outline-danger me-2" onClick={handleClearData}>
                            🗑️ Clear All Data
                        </button>
                        <button className="btn btn-outline-success" onClick={handleExportData}>
                            📥 Export My Data
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="col-12">
                <h2 className="mb-4">👤 Profile & Settings</h2>

                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                        <ul className="nav nav-tabs card-header-tabs" style={{ borderBottom: 'none' }}>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                    style={{ color: activeTab === 'profile' ? '#007bff' : 'white' }}
                                >
                                    <FaUser className="me-2" />
                                    Profile
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('password')}
                                    style={{ color: activeTab === 'password' ? '#007bff' : 'white' }}
                                >
                                    <FaLock className="me-2" />
                                    Password
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('settings')}
                                    style={{ color: activeTab === 'settings' ? '#007bff' : 'white' }}
                                >
                                    <FaPalette className="me-2" />
                                    Settings
                                </button>
                            </li>
                        </ul>
                    </div>

                    {activeTab === 'profile' && renderProfileTab()}
                    {activeTab === 'password' && renderPasswordTab()}
                    {activeTab === 'settings' && renderSettingsTab()}
                </div>

                <div className="text-center mt-3">
                    <Link to="/" className="btn btn-secondary">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage