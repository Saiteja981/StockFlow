import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock } from 'react-icons/fa'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            console.log('🔐 Login attempt with:', formData)

            // ✅ Get registered users from localStorage
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

            console.log('📊 Registered users:', users) // Debug log

            // ✅ Find user by email
            const foundUser = users.find(u =>
                u.email === formData.email && u.password === formData.password
            )

            if (foundUser) {
                // ✅ Save actual user data
                localStorage.setItem('isLoggedIn', 'true')
                localStorage.setItem('user', JSON.stringify({
                    id: foundUser.id,
                    name: foundUser.name,        // ✅ Actual user name
                    email: foundUser.email,
                    phone: foundUser.phone || '+1 234 567 8900',
                    role: foundUser.role || 'User'
                }))

                console.log('✅ Login successful for user:', foundUser.name)
                console.log('📦 isLoggedIn:', localStorage.getItem('isLoggedIn'))
                console.log('👤 user:', localStorage.getItem('user'))

                setLoading(false)
                navigate('/')
                window.location.reload()
            } else {
                // ✅ Check if user exists but password wrong
                const userExists = users.some(u => u.email === formData.email)
                if (userExists) {
                    setError('❌ Invalid password. Please try again.')
                } else {
                    setError('❌ User not found. Please register first.')
                }
                setLoading(false)
            }

        } catch (error) {
            console.error('❌ Login error:', error)
            setError('❌ Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
                <div className="card shadow" style={{ marginTop: '60px' }}>
                    <div className="card-header bg-primary text-white">
                        <h3 className="text-center mb-0">🔐 Login</h3>
                    </div>
                    <div className="card-body" style={{ padding: '30px' }}>
                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaEnvelope /></span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaLock /></span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                                style={{ padding: '10px' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        <hr className="my-4" />

                        <div className="text-center">
                            <p className="mb-0">
                                Don't have an account?{' '}
                                <Link to="/register" className="fw-bold">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login