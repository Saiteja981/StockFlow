import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            // Simulate API call - Replace with actual backend call
            console.log('Registration attempt:', formData)

            // For demo, accept any registration
            // In production, call your auth API:
            // const response = await authApi.register(formData)

            setLoading(false)
            alert('Registration successful! Please login.')
            navigate('/login')
        } catch (error) {
            setError('Registration failed. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
                <div className="card shadow" style={{ marginTop: '40px' }}>
                    <div className="card-header bg-success text-white">
                        <h3 className="text-center mb-0">📝 Register</h3>
                    </div>
                    <div className="card-body" style={{ padding: '30px' }}>
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Full Name *</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email Address *</label>
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
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Password *</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaLock /></span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min 6 characters"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Confirm Password *</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaLock /></span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phone Number (Optional)</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaPhone /></span>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="terms" required />
                                    <label className="form-check-label" htmlFor="terms">
                                        I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={loading}
                                style={{ padding: '10px' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Registering...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <hr className="my-4" />

                        <div className="text-center">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <Link to="/login" className="fw-bold">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register