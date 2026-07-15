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

            // ✅ Set login state
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('user', JSON.stringify({
                name: 'Admin',
                email: formData.email,
                phone: '+1 234 567 8900',
                role: 'Admin'
            }))

            console.log('✅ Login successful - localStorage set')
            console.log('📦 isLoggedIn:', localStorage.getItem('isLoggedIn'))
            console.log('👤 user:', localStorage.getItem('user'))

            setLoading(false)

            // ✅ Navigate to dashboard
            navigate('/')

            // ✅ Force reload to update navbar
            window.location.reload()

        } catch (error) {
            console.error('❌ Login error:', error)
            setError('Invalid email or password')
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