import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaUpload, FaDownload, FaFileCsv, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { productApi } from '../../services/api'
import { toast } from 'react-toastify'

const BulkImport = () => {
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState([])
    const [progress, setProgress] = useState(0)
    const [importedCount, setImportedCount] = useState(0)
    const [errorCount, setErrorCount] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.CSV')) {
                toast.error('Please select a CSV file')
                e.target.value = ''
                return
            }

            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB')
                e.target.value = ''
                return
            }

            setFile(selectedFile)
            setProgress(0)
            setImportedCount(0)
            setErrorCount(0)
            setIsComplete(false)

            // Preview CSV
            const reader = new FileReader()
            reader.onload = (event) => {
                const text = event.target.result
                const lines = text.split('\n').filter(line => line.trim())
                const headers = lines[0].split(',').map(h => h.trim())
                const data = lines.slice(1, 7).map(line => {
                    const values = line.split(',').map(v => v.trim())
                    return headers.reduce((obj, header, index) => {
                        obj[header] = values[index] || ''
                        return obj
                    }, {})
                })
                setPreview(data)
            }
            reader.readAsText(selectedFile)
        }
    }

    const handleImport = async () => {
        if (!file) {
            toast.error('Please select a file first')
            return
        }

        setLoading(true)
        setProgress(0)
        setImportedCount(0)
        setErrorCount(0)
        setIsComplete(false)

        try {
            const reader = new FileReader()
            reader.onload = async (event) => {
                const text = event.target.result
                const lines = text.split('\n').filter(line => line.trim())
                const headers = lines[0].split(',').map(h => h.trim())

                const products = []

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim())
                    const product = {
                        name: values[headers.indexOf('name')] || '',
                        category: values[headers.indexOf('category')] || '',
                        brand: values[headers.indexOf('brand')] || '',
                        purchasePrice: parseFloat(values[headers.indexOf('purchasePrice')]) || 0,
                        sellingPrice: parseFloat(values[headers.indexOf('sellingPrice')]) || 0,
                        stock: parseInt(values[headers.indexOf('stock')]) || 0
                    }

                    if (product.name) {
                        products.push(product)
                    }
                }

                if (products.length === 0) {
                    toast.error('No valid products found in the file')
                    setLoading(false)
                    return
                }

                let imported = 0
                for (let i = 0; i < products.length; i++) {
                    try {
                        await productApi.create(products[i])
                        imported++
                        setImportedCount(imported)
                        setProgress(Math.round((i + 1) / products.length * 100))
                    } catch (error) {
                        setErrorCount(prev => prev + 1)
                        console.error('Error importing product:', products[i], error)
                    }
                }

                setIsComplete(true)
                setLoading(false)

                if (imported > 0) {
                    toast.success(`✅ ${imported} products imported successfully!`)
                } else {
                    toast.error('❌ No products were imported. Please check your file format.')
                }
            }
            reader.readAsText(file)
        } catch (error) {
            console.error('Import error:', error)
            toast.error('❌ Failed to import products')
            setLoading(false)
        }
    }

    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                    <FaUpload className="me-2" />
                    Bulk Import Products
                </h4>
            </div>
            <div className="card-body">
                {/* CSV Format Guide */}
                <div className="alert alert-info">
                    <div className="d-flex align-items-start">
                        <FaFileCsv className="me-2 mt-1" size={20} />
                        <div>
                            <strong>CSV Format Required:</strong>
                            <br />
                            <code className="d-block mt-1 p-2 bg-light rounded" style={{ fontSize: '13px' }}>
                                name,category,brand,purchasePrice,sellingPrice,stock
                                <br />
                                Laptop,Electronics,Dell,800,1200,10
                                <br />
                                Phone,Electronics,Apple,600,900,15
                                <br />
                                Monitor,Electronics,Samsung,300,450,8
                            </code>
                            <small className="text-muted mt-1 d-block">
                                📌 First row must be headers. All fields are required.
                            </small>
                        </div>
                    </div>
                </div>

                {/* File Input */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Select CSV File</label>
                    <input
                        type="file"
                        className="form-control"
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    {file && (
                        <small className="text-success d-block mt-1">
                            ✅ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </small>
                    )}
                </div>

                {/* Progress Bar */}
                {loading && (
                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                            <span>Importing products...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="progress" style={{ height: '20px' }}>
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                                style={{ width: `${progress}%` }}
                            >
                                {progress}%
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                            <small className="text-success">✅ Imported: {importedCount}</small>
                            <small className="text-danger">❌ Errors: {errorCount}</small>
                        </div>
                    </div>
                )}

                {/* Completion Status */}
                {isComplete && !loading && (
                    <div className="alert alert-success">
                        <FaCheckCircle className="me-2" />
                        Import completed! {importedCount} products imported successfully.
                        {errorCount > 0 && ` ${errorCount} failed.`}
                        <Link to="/products" className="btn btn-sm btn-success ms-3">
                            View Products
                        </Link>
                    </div>
                )}

                {/* Preview */}
                {preview.length > 0 && !loading && (
                    <div className="mb-3">
                        <h6>
                            <FaFileCsv className="me-2" />
                            Preview (First {preview.length} rows)
                        </h6>
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered table-hover">
                                <thead className="table-light">
                                <tr>
                                    {Object.keys(preview[0]).map(key => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {preview.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{value || '-'}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="d-flex flex-wrap gap-2">
                    <button
                        className="btn btn-success"
                        onClick={handleImport}
                        disabled={!file || loading}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="me-2 fa-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <FaUpload className="me-2" />
                                Import Products
                            </>
                        )}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/products')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-outline-info"
                        onClick={() => {
                            const sample = 'name,category,brand,purchasePrice,sellingPrice,stock\n' +
                                'Laptop,Electronics,Dell,800,1200,10\n' +
                                'Phone,Electronics,Apple,600,900,15\n' +
                                'Monitor,Electronics,Samsung,300,450,8\n' +
                                'Keyboard,Accessories,Logitech,50,80,20'
                            const blob = new Blob([sample], { type: 'text/csv' })
                            const link = document.createElement('a')
                            link.href = URL.createObjectURL(blob)
                            link.download = 'sample_products.csv'
                            link.click()
                            toast.info('📥 Sample CSV downloaded!')
                        }}
                        disabled={loading}
                    >
                        <FaDownload className="me-2" />
                        Download Sample
                    </button>
                </div>

                {/* Tips */}
                <div className="mt-3 p-3 bg-light rounded">
                    <h6>💡 Tips for Bulk Import</h6>
                    <ul className="mb-0 ps-3">
                        <li>Use the <strong>Download Sample</strong> button to get the correct format</li>
                        <li>Make sure all required fields are filled</li>
                        <li>Prices should be numbers (e.g., 800, not $800)</li>
                        <li>Stock should be whole numbers (e.g., 10, not 10.5)</li>
                        <li>Maximum file size: 5MB</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BulkImport