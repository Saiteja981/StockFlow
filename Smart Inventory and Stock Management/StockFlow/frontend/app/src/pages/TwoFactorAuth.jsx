import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'  // ✅ Add Link here
import { FaLock, FaShieldAlt, FaMobileAlt, FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'

const TwoFactorAuth = () => {
    const navigate = useNavigate()
    const [method, setMethod] = useState('email')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState('setup') // setup, verify, success
    const [resendCount, setResendCount] = useState(0)
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    const handleSetup = async () => {
        setLoading(true)
        try {
            // In production, send code via email/SMS
            toast.info(`📧 Verification code sent to your ${method}`)
            setStep('verify')
            setTimer(60) // 60 seconds cooldown
            toast.success('✅ Code sent! Please check your ' + method)
        } catch (error) {
            toast.error('Failed to send verification code')
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async () => {
        setLoading(true)
        try {
            if (code.length === 6) {
                // In production, verify code with backend
                toast.success('✅ 2FA enabled successfully!')
                setStep('success')
                setTimeout(() => {
                    navigate('/profile')
                }, 2000)
            } else {
                toast.error('Invalid code. Please enter 6 digits.')
            }
        } catch (error) {
            toast.error('Verification failed')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = () => {
        if (timer === 0) {
            setResendCount(resendCount + 1)
            setTimer(60)
            toast.info(`📧 New code sent to your ${method}`)
        }
    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
                <div className="card shadow" style={{ marginTop: '40px' }}>
                    <div className="card-header bg-primary text-white">
                        <h4 className="text-center mb-0">
                            <FaShieldAlt className="me-2" />
                            Two-Factor Authentication
                        </h4>
                    </div>
                    <div className="card-body" style={{ padding: '30px' }}>
                        {step === 'setup' && (
                            <>
                                <div className="text-center mb-4">
                                    <FaLock size={50} className="text-primary mb-3" />
                                    <p className="text-muted">
                                        Enhance your account security by enabling 2FA
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Choose verification method</label>
                                    <div className="d-flex gap-2">
                                        <button
                                            className={`btn ${method === 'email' ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1`}
                                            onClick={() => setMethod('email')}
                                            style={{ padding: '12px' }}
                                        >
                                            <FaEnvelope className="me-2" />
                                            Email
                                        </button>
                                        <button
                                            className={`btn ${method === 'sms' ? 'btn-primary' : 'btn-outline-secondary'} flex-grow-1`}
                                            onClick={() => setMethod('sms')}
                                            style={{ padding: '12px' }}
                                        >
                                            <FaMobileAlt className="me-2" />
                                            SMS
                                        </button>
                                    </div>
                                </div>

                                <div className="alert alert-info">
                                    <small>
                                        <strong>💡 {method === 'email' ? 'Email' : 'SMS'} Verification</strong>
                                        <br />
                                        A 6-digit code will be sent to your {method === 'email' ? 'email address' : 'phone number'}
                                    </small>
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handleSetup}
                                    disabled={loading}
                                    style={{ padding: '12px' }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Verification Code'
                                    )}
                                </button>

                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        <FaArrowLeft className="me-1" />
                                        <Link to="/profile" className="text-decoration-none">
                                            Back to Profile
                                        </Link>
                                    </small>
                                </div>
                            </>
                        )}

                        {step === 'verify' && (
                            <>
                                <div className="text-center mb-4">
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e9ecef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 15px'
                                        }}
                                    >
                                        <FaEnvelope size={35} className="text-primary" />
                                    </div>
                                    <h5>Enter Verification Code</h5>
                                    <p className="text-muted small">
                                        A 6-digit code was sent to your {method}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Verification Code</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center"
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        maxLength="6"
                                        autoFocus
                                        style={{
                                            letterSpacing: '12px',
                                            fontSize: '28px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </div>

                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleVerify}
                                    disabled={loading || code.length !== 6}
                                    style={{ padding: '12px' }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </button>

                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        Didn't receive code?{' '}
                                        {timer > 0 ? (
                                            <span className="text-warning">
                                                Resend in {timer}s
                                            </span>
                                        ) : (
                                            <button
                                                className="btn btn-link btn-sm p-0"
                                                onClick={handleResend}
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </small>
                                </div>
                                <div className="text-center mt-2">
                                    <small>
                                        <button
                                            className="btn btn-link btn-sm p-0"
                                            onClick={() => setStep('setup')}
                                        >
                                            ← Change method
                                        </button>
                                    </small>
                                </div>
                            </>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-4">
                                <FaCheckCircle size={60} className="text-success mb-3" />
                                <h4 className="text-success">2FA Enabled!</h4>
                                <p className="text-muted">
                                    Your account is now more secure.
                                </p>
                                <div className="mt-3">
                                    <div className="alert alert-success">
                                        <small>
                                            ✅ Two-factor authentication has been enabled for your account
                                        </small>
                                    </div>
                                </div>
                                <div className="spinner-border text-primary mt-3" role="status">
                                    <span className="visually-hidden">Redirecting...</span>
                                </div>
                                <p className="text-muted small mt-2">
                                    Redirecting to profile...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TwoFactorAuth