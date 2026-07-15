import React, { useState } from 'react'
import { FaFileExcel, FaFileCode, FaFilePdf, FaDownload } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ExportButton = ({ data, filename = 'export', headers = [] }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Export to CSV
    const exportToCSV = () => {
        try {
            if (!data || data.length === 0) {
                alert('❌ No data to export!')
                return
            }

            let exportHeaders = headers
            if (exportHeaders.length === 0 && data.length > 0) {
                exportHeaders = Object.keys(data[0])
            }

            const csvRows = []
            csvRows.push(exportHeaders.join(','))

            for (const row of data) {
                const values = exportHeaders.map(header => {
                    let value = row[header] || ''
                    if (typeof value === 'object') {
                        value = JSON.stringify(value)
                    }
                    return `"${String(value).replace(/"/g, '""')}"`
                })
                csvRows.push(values.join(','))
            }

            const csvString = csvRows.join('\n')
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            const date = new Date().toISOString().split('T')[0]
            link.download = `${filename}-${date}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)

            setIsOpen(false)
        } catch (error) {
            console.error('Export error:', error)
            alert('❌ Failed to export CSV: ' + error.message)
        }
    }

    // Export to JSON
    const exportToJSON = () => {
        try {
            if (!data || data.length === 0) {
                alert('❌ No data to export!')
                return
            }

            const jsonString = JSON.stringify(data, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            const date = new Date().toISOString().split('T')[0]
            link.download = `${filename}-${date}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)

            setIsOpen(false)
        } catch (error) {
            console.error('Export error:', error)
            alert('❌ Failed to export JSON: ' + error.message)
        }
    }

    // Export to PDF
    const exportToPDF = () => {
        try {
            if (!data || data.length === 0) {
                alert('❌ No data to export!')
                return
            }

            setLoading(true)

            const doc = new jsPDF('landscape', 'mm', 'a4')
            const pageWidth = doc.internal.pageSize.getWidth()

            // Add Title
            doc.setFontSize(18)
            doc.setTextColor(33, 37, 41)
            doc.text('Sales Report', pageWidth / 2, 15, { align: 'center' })

            // Add Date
            doc.setFontSize(10)
            doc.setTextColor(108, 117, 125)
            const dateStr = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            doc.text(`Generated: ${dateStr}`, pageWidth / 2, 22, { align: 'center' })

            // Add summary
            doc.setFontSize(9)
            doc.setTextColor(33, 37, 41)
            const totalRevenue = data.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
            const totalItems = data.length
            doc.text(`Total Records: ${totalItems}`, 14, 30)
            doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 36)

            // Get headers
            let exportHeaders = headers
            if (exportHeaders.length === 0 && data.length > 0) {
                exportHeaders = Object.keys(data[0])
            }

            // Format headers for display
            const displayHeaders = exportHeaders.map(h =>
                h.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/_/g, ' ')
            )

            // Prepare data for table
            const tableData = data.map(row => {
                return exportHeaders.map(header => {
                    let value = row[header] || ''
                    if (typeof value === 'object') {
                        value = JSON.stringify(value)
                    }
                    if (header.toLowerCase().includes('price') ||
                        header.toLowerCase().includes('amount') ||
                        header.toLowerCase().includes('revenue') ||
                        header.toLowerCase().includes('cost')) {
                        value = '$' + parseFloat(value || 0).toFixed(2)
                    }
                    if (header.toLowerCase().includes('date')) {
                        try {
                            value = new Date(value).toLocaleDateString()
                        } catch (e) {}
                    }
                    return String(value)
                })
            })

            // Add table
            autoTable(doc, {
                head: [displayHeaders],
                body: tableData,
                startY: 38,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    textColor: [33, 37, 41],
                },
                headStyles: {
                    fillColor: [13, 110, 253],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                alternateRowStyles: {
                    fillColor: [248, 249, 250],
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                },
                margin: { left: 10, right: 10 },
                tableWidth: 'auto',
                didDrawPage: function(data) {
                    // Footer
                    doc.setFontSize(8)
                    doc.setTextColor(108, 117, 125)
                    const footerText = `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`
                    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
                }
            })

            // Save PDF
            const date = new Date().toISOString().split('T')[0]
            doc.save(`${filename}-${date}.pdf`)

            setLoading(false)
            setIsOpen(false)
        } catch (error) {
            console.error('PDF Export error:', error)
            alert('❌ Failed to export PDF: ' + error.message)
            setLoading(false)
        }
    }

    return (
        <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn btn-success"
                onClick={() => setIsOpen(!isOpen)}
                disabled={!data || data.length === 0 || loading}
            >
                <FaDownload className="me-2" />
                {loading ? 'Generating...' : `Export (${data?.length || 0})`}
            </button>

            {isOpen && (
                <div
                    className="dropdown-menu show"
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        display: 'block',
                        minWidth: '220px',
                        padding: '8px 0',
                        zIndex: 1000,
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    <button
                        className="dropdown-item"
                        onClick={exportToCSV}
                        style={{
                            padding: '10px 20px',
                            width: '100%',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        <FaFileExcel color="#28a745" size={18} />
                        <span>Export as CSV</span>
                    </button>

                    <button
                        className="dropdown-item"
                        onClick={exportToJSON}
                        style={{
                            padding: '10px 20px',
                            width: '100%',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        <FaFileCode color="#007bff" size={18} />
                        <span>Export as JSON</span>
                    </button>

                    <button
                        className="dropdown-item"
                        onClick={exportToPDF}
                        style={{
                            padding: '10px 20px',
                            width: '100%',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                        disabled={loading}
                    >
                        <FaFilePdf color="#dc3545" size={18} />
                        <span>{loading ? 'Generating PDF...' : 'Export as PDF'}</span>
                    </button>
                </div>
            )}

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    )
}

export default ExportButton