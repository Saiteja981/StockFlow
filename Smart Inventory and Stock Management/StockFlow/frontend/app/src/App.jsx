import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/common/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfilePage from './pages/ProfilePage'
import SalesAnalytics from './pages/SalesAnalytics'
import ProductList from './components/products/ProductList'
import AddProduct from './components/products/AddProduct'
import UpdateStock from './components/products/UpdateStock'
import PurchasesPage from './pages/PurchasesPage'
import SalesPage from './pages/SalesPage'
import Forecasting from './pages/Forecasting'
import CustomersPage from './pages/CustomersPage'
import BulkImport from './components/products/BulkImport'
import BarcodeScanner from './components/products/BarcodeScanner'
import { productApi } from './services/api'
import { toast } from 'react-toastify'

// ✅ Import Payment Pages
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccess from './pages/PaymentSuccess'

// ✅ Import Priority 1 Features
import StockReport from './pages/StockReport'
import ReorderSettings from './pages/ReorderSettings'
import InvoiceGenerator from './pages/InvoiceGenerator'

// ✅ Import New Features
import SuppliersPage from './pages/SuppliersPage'
import RealtimeDashboard from './pages/RealtimeDashboard'
import PaymentGateway from './pages/PaymentGateway'

// ✅ Import Priority 1 - High Impact Features
import ProfitLossDashboard from './pages/ProfitLossDashboard'
import TwoFactorAuth from './pages/TwoFactorAuth'

import './App.css'

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    return isLoggedIn ? children : <Navigate to="/login" />
}

function App() {
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

    React.useEffect(() => {
        const handleOpenScanner = () => {
            console.log('🔍 Opening scanner from App.jsx')
            setShowBarcodeScanner(true)
        }

        window.addEventListener('openBarcodeScanner', handleOpenScanner)

        return () => {
            window.removeEventListener('openBarcodeScanner', handleOpenScanner)
        }
    }, [])

    const handleBarcodeScan = async (barcode) => {
        console.log('📷 Scanned:', barcode)
        try {
            const response = await productApi.getAll()
            const products = response.data

            const product = products.find(p =>
                String(p.id || p.productId) === String(barcode)
            )

            if (product) {
                toast.success(`✅ Found: ${product.name || product.productName}`)
                setShowBarcodeScanner(false)
                window.location.href = `/updateStock/${product.id || product.productId}`
            } else {
                const nameMatch = products.find(p =>
                    (p.name || p.productName || '').toLowerCase().includes(barcode.toLowerCase())
                )
                if (nameMatch) {
                    toast.success(`✅ Found: ${nameMatch.name || nameMatch.productName}`)
                    setShowBarcodeScanner(false)
                    window.location.href = `/updateStock/${nameMatch.id || nameMatch.productId}`
                } else {
                    toast.error('❌ Product not found for this barcode')
                }
            }
        } catch (error) {
            console.error('Error finding product:', error)
            toast.error('❌ Error finding product')
        }
    }

    return (
        <>
            <Router>
                <div className="App">
                    <Navbar />
                    <div className="container mt-4">
                        <Routes>
                            {/* ================================
                                PUBLIC ROUTES
                            ================================ */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* ================================
                                PROTECTED ROUTES
                            ================================ */}

                            {/* Dashboard */}
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />

                            {/* Profile */}
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } />

                            {/* Analytics & Reports */}
                            <Route path="/analytics" element={
                                <ProtectedRoute>
                                    <SalesAnalytics />
                                </ProtectedRoute>
                            } />
                            <Route path="/forecasting" element={
                                <ProtectedRoute>
                                    <Forecasting />
                                </ProtectedRoute>
                            } />

                            {/* Customer Management */}
                            <Route path="/customers" element={
                                <ProtectedRoute>
                                    <CustomersPage />
                                </ProtectedRoute>
                            } />

                            {/* Bulk Import */}
                            <Route path="/bulk-import" element={
                                <ProtectedRoute>
                                    <BulkImport />
                                </ProtectedRoute>
                            } />

                            {/* Products */}
                            <Route path="/products" element={
                                <ProtectedRoute>
                                    <ProductList />
                                </ProtectedRoute>
                            } />
                            <Route path="/addProduct" element={
                                <ProtectedRoute>
                                    <AddProduct />
                                </ProtectedRoute>
                            } />
                            <Route path="/updateStock/:id" element={
                                <ProtectedRoute>
                                    <UpdateStock />
                                </ProtectedRoute>
                            } />

                            {/* Purchase & Sales */}
                            <Route path="/purchase" element={
                                <ProtectedRoute>
                                    <PurchasesPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/sales" element={
                                <ProtectedRoute>
                                    <SalesPage />
                                </ProtectedRoute>
                            } />

                            {/* ================================
                                ✅ PAYMENT ROUTES
                            ================================ */}
                            <Route path="/checkout" element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/payment-success" element={
                                <ProtectedRoute>
                                    <PaymentSuccess />
                                </ProtectedRoute>
                            } />

                            {/* ================================
                                ✅ PRIORITY 1 FEATURES
                            ================================ */}
                            {/* Stock Report */}
                            <Route path="/stock-report" element={
                                <ProtectedRoute>
                                    <StockReport />
                                </ProtectedRoute>
                            } />

                            {/* Reorder Settings */}
                            <Route path="/reorder-settings" element={
                                <ProtectedRoute>
                                    <ReorderSettings />
                                </ProtectedRoute>
                            } />

                            {/* Invoice Generator */}
                            <Route path="/invoice/:id" element={
                                <ProtectedRoute>
                                    <InvoiceGenerator />
                                </ProtectedRoute>
                            } />

                            {/* ================================
                                ✅ NEW FEATURES
                            ================================ */}
                            {/* Supplier Management */}
                            <Route path="/suppliers" element={
                                <ProtectedRoute>
                                    <SuppliersPage />
                                </ProtectedRoute>
                            } />

                            {/* Real-time Dashboard */}
                            <Route path="/realtime-dashboard" element={
                                <ProtectedRoute>
                                    <RealtimeDashboard />
                                </ProtectedRoute>
                            } />

                            {/* Payment Gateway */}
                            <Route path="/payment-gateway" element={
                                <ProtectedRoute>
                                    <PaymentGateway />
                                </ProtectedRoute>
                            } />

                            {/* ================================
                                ✅ PRIORITY 1 - HIGH IMPACT FEATURES
                            ================================ */}
                            {/* Profit & Loss Dashboard */}
                            <Route path="/profit-loss" element={
                                <ProtectedRoute>
                                    <ProfitLossDashboard />
                                </ProtectedRoute>
                            } />

                            {/* Two-Factor Authentication */}
                            <Route path="/2fa" element={
                                <ProtectedRoute>
                                    <TwoFactorAuth />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </div>
                </div>
            </Router>

            {/* Barcode Scanner Modal */}
            {showBarcodeScanner && (
                <BarcodeScanner
                    onScan={handleBarcodeScan}
                    onClose={() => setShowBarcodeScanner(false)}
                />
            )}

            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default App