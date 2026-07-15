import React, { useState, useRef, useEffect } from 'react'
import { FaCamera, FaTimes, FaCheck } from 'react-icons/fa'

const BarcodeScanner = ({ onScan, onClose }) => {
    const [barcode, setBarcode] = useState('')
    const [error, setError] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 200)
    }, [])

    const handleScan = () => {
        if (barcode && barcode.trim().length >= 1) {
            if (onScan) {
                onScan(barcode.trim())
            }
            setBarcode('')
        } else {
            setError('Please enter a valid barcode')
            setTimeout(() => setError(''), 3000)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleScan()
        }
    }

    return (
        <div
            className="modal show d-block"
            style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget && onClose) {
                    onClose()
                }
            }}
        >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '450px' }}>
                <div className="modal-content" style={{ borderRadius: '12px' }}>
                    <div className="modal-header bg-primary text-white" style={{ borderRadius: '12px 12px 0 0' }}>
                        <h5 className="modal-title">
                            <FaCamera className="me-2" />
                            Scan Barcode
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body" style={{ padding: '30px' }}>
                        <div className="text-center mb-4">
                            <div
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e9ecef',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto'
                                }}
                            >
                                <FaCamera size={30} className="text-primary" />
                            </div>
                            <h6 className="mt-3 fw-bold">Enter Barcode Number</h6>
                            <p className="text-muted small">Type the product ID or barcode and press Enter</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger alert-sm">{error}</div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-bold">Barcode / Product ID</label>
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Enter barcode or product ID..."
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-success flex-grow-1"
                                onClick={handleScan}
                                disabled={!barcode}
                                style={{ padding: '10px' }}
                            >
                                <FaCheck className="me-2" />
                                Scan
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                                style={{ padding: '10px 20px' }}
                            >
                                <FaTimes className="me-1" />
                                Cancel
                            </button>
                        </div>

                        <div className="mt-3 text-center">
                            <small className="text-muted">
                                💡 Tip: Enter the product ID (e.g., 1, 2, 3) to quickly find a product
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarcodeScanner