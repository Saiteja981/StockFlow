import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Simulated payment processing
export const processPayment = async (paymentData) => {
    // In production, this would call your backend payment gateway
    // For now, simulate payment processing

    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            const isValid = validatePayment(paymentData)

            if (isValid) {
                resolve({
                    success: true,
                    transactionId: 'TXN-' + Date.now(),
                    amount: paymentData.amount,
                    status: 'completed',
                    timestamp: new Date().toISOString()
                })
            } else {
                reject({
                    success: false,
                    message: 'Payment failed. Please check your payment details.'
                })
            }
        }, 1500)
    })
}

const validatePayment = (data) => {
    // Basic validation
    if (!data.cardNumber || data.cardNumber.length < 16) return false
    if (!data.expiryMonth || !data.expiryYear) return false
    if (!data.cvv || data.cvv.length < 3) return false
    if (!data.amount || data.amount <= 0) return false

    return true
}

// Get payment methods
export const getPaymentMethods = async () => {
    return [
        { id: 'credit_card', name: 'Credit Card', icon: '💳' },
        { id: 'debit_card', name: 'Debit Card', icon: '💳' },
        { id: 'paypal', name: 'PayPal', icon: '🅿️' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' }
    ]
}

// Get transaction history
export const getTransactionHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/transactions`)
        return response.data
    } catch (error) {
        // Return mock data if API not available
        return [
            { id: 1, date: '2024-01-15', amount: 150.00, status: 'completed', description: 'Product Purchase' },
            { id: 2, date: '2024-01-14', amount: 75.50, status: 'completed', description: 'Product Purchase' },
            { id: 3, date: '2024-01-13', amount: 200.00, status: 'pending', description: 'Product Purchase' }
        ]
    }
}