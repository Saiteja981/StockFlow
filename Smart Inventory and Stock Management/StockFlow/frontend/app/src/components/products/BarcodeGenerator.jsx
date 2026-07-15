import React, { useState, useRef, useEffect } from 'react'
import { FaBarcode, FaDownload, FaPrint, FaCopy, FaRandom } from 'react-icons/fa'
import JsBarcode from 'jsbarcode'
import { toast } from 'react-toastify'

const BarcodeGenerator = ({ product }) => {
    const [barcodeValue, setBarcodeValue] = useState('')
    const [format, setFormat] = useState('CODE128')
    const [width, setWidth] = useState(2)
    const [height, setHeight] = useState(100)
    const [displayValue, setDisplayValue] = useState(true)
    const [fontSize, setFontSize] = useState(20)
    const barcodeRef = useRef(null)
    const svgRef = useRef(null)
    const [generated, setGenerated] = useState(false)

    const formats = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF', 'MSI', 'Pharmacode']

    useEffect(() => {
        if (product) {
            const id = product.id || product.productId || Math.floor(Math.random() * 1000000)
            setBarcodeValue(String(id).padStart(12, '0'))
            // Auto-generate on product load
            setTimeout(() => setGenerated(true), 100)
        }
    }, [product])

    useEffect(() => {
        if (barcodeRef.current && barcodeValue && generated) {
            try {
                JsBarcode(barcodeRef.current, barcodeValue, {
                    format: format,
                    width: width,
                    height: height,
                    displayValue: displayValue,
                    fontSize: fontSize,
                    background: '#ffffff',
                    lineColor: '#000000',
                    margin: 10,
                    font: 'monospace'
                })
            } catch (error) {
                console.error('Barcode generation error:', error)
                toast.error('Error generating barcode')
            }
        }
    }, [barcodeValue, format, width, height, displayValue, fontSize, generated])

    const handleGenerate = () => {
        if (!barcodeValue) {
            toast.error('Please enter a barcode value')
            return
        }
        if (barcodeValue.length < 4) {
            toast.warning('Barcode value should be at least 4 characters')
            return
        }
        setGenerated(true)
        toast.success('✅ Barcode generated!')
    }

    const handleDownload = () => {
        if (!svgRef.current) {
            toast.error('Please generate a barcode first')
            return
        }

        try {
            const svgData = new XMLSerializer().serializeToString(svgRef.current)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)
                const link = document.createElement('a')
                link.download = `barcode-${barcodeValue}.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
                URL.revokeObjectURL(url)
                toast.success('📥 Barcode downloaded!')
            }
            img.onerror = () => {
                toast.error('Failed to convert barcode')
            }
            img.src = url
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Failed to download barcode')
        }
    }

    const handlePrint = () => {
        if (!svgRef.current) {
            toast.error('Please generate a barcode first')
            return
        }

        const printWindow = window.open('', '_blank', 'width=400,height=200')
        if (printWindow) {
            const svgContent = svgRef.current ? svgRef.current.outerHTML : ''
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Barcode Print</title>
                        <style>
                            body {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                background: white;
                            }
                            svg {
                                max-width: 90%;
                            }
                            @media print {
                                body { margin: 0; padding: 20px; }
                                svg { max-width: 100%; }
                            }
                        </style>
                    </head>
                    <body>
                        ${svgContent}
                    </body>
                </html>
            `)
            printWindow.document.close()
            setTimeout(() => {
                printWindow.print()
            }, 500)
        }
    }

    const handleCopy = () => {
        if (!barcodeValue) {
            toast.error('No barcode to copy')
            return
        }
        navigator.clipboard.writeText(barcodeValue)
            .then(() => toast.success('📋 Barcode copied to clipboard!'))
            .catch(() => toast.error('Failed to copy barcode'))
    }

    const generateRandomBarcode = () => {
        const random = Math.floor(100000000000 + Math.random() * 900000000000)
        setBarcodeValue(String(random))
        setGenerated(true)
        toast.success('🎲 Random barcode generated!')
    }

    if (!product) {
        return (
            <div className="alert alert-info text-center py-4">
                <FaBarcode size={40} className="d-block mx-auto mb-3 text-primary" />
                <h5>No Product Selected</h5>
                <p className="text-muted">Select a product from the list to generate its barcode</p>
            </div>
        )
    }

    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0 d-flex align-items-center">
                    <FaBarcode className="me-2" />
                    Barcode Generator
                    <span className="badge bg-light text-dark ms-2">
                        {product.name || product.productName || 'N/A'}
                    </span>
                </h5>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-6">
                        {/* Product Info */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Product</label>
                            <input
                                type="text"
                                className="form-control"
                                value={product.name || product.productName || 'N/A'}
                                readOnly
                            />
                        </div>

                        {/* Barcode Value */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Barcode Value</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={barcodeValue}
                                    onChange={(e) => setBarcodeValue(e.target.value)}
                                    placeholder="Enter barcode value"
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={generateRandomBarcode}
                                    title="Generate Random"
                                >
                                    <FaRandom />
                                </button>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Format</label>
                                <select
                                    className="form-select"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    {formats.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Width: {width}px</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                    value={width}
                                    onChange={(e) => setWidth(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Height: {height}px</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="50"
                                    max="200"
                                    step="10"
                                    value={height}
                                    onChange={(e) => setHeight(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Font Size: {fontSize}px</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="10"
                                    max="40"
                                    step="2"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="displayValue"
                                    checked={displayValue}
                                    onChange={(e) => setDisplayValue(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="displayValue">
                                    Show value below barcode
                                </label>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleGenerate}
                        >
                            <FaBarcode className="me-2" />
                            Generate Barcode
                        </button>
                    </div>

                    <div className="col-lg-6">
                        {/* Barcode Display */}
                        <div className="border rounded p-4 text-center" style={{
                            minHeight: '200px',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {barcodeValue && generated ? (
                                <svg ref={svgRef}>
                                    <svg ref={barcodeRef}></svg>
                                </svg>
                            ) : (
                                <div className="py-4">
                                    <FaBarcode size={60} className="d-block mx-auto mb-3 text-muted" />
                                    <p className="text-muted">Enter a value and click Generate</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {barcodeValue && generated && (
                            <div className="mt-3 d-flex gap-2 justify-content-center flex-wrap">
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={handleDownload}
                                >
                                    <FaDownload className="me-1" /> Download
                                </button>
                                <button
                                    className="btn btn-info btn-sm text-white"
                                    onClick={handlePrint}
                                >
                                    <FaPrint className="me-1" /> Print
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleCopy}
                                >
                                    <FaCopy className="me-1" /> Copy
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarcodeGenerator