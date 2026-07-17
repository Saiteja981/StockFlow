import { toast } from 'react-toastify'

// Simulated email service - Replace with actual email API
export const sendEmail = async (to, subject, body) => {
    // In production, this would call your backend API
    console.log('📧 Sending email...')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Body:', body)

    return new Promise((resolve) => {
        setTimeout(() => {
            toast.success(`📧 Email sent to ${to}`)
            resolve({ success: true })
        }, 1000)
    })
}

export const sendLowStockAlert = async (product, stock) => {
    const subject = `⚠️ Low Stock Alert: ${product.name || product.productName}`
    const body = `
        <h2>Low Stock Alert</h2>
        <p>The following product is running low on stock:</p>
        <ul>
            <li><strong>Product:</strong> ${product.name || product.productName}</li>
            <li><strong>Current Stock:</strong> ${stock}</li>
            <li><strong>Category:</strong> ${product.category || 'N/A'}</li>
            <li><strong>Brand:</strong> ${product.brand || 'N/A'}</li>
        </ul>
        <p>Please restock as soon as possible.</p>
    `
    return sendEmail('admin@example.com', subject, body)
}

export const sendOrderConfirmation = async (order) => {
    const subject = `✅ Order Confirmed: #${order.id || 'N/A'}`
    const body = `
        <h2>Order Confirmation</h2>
        <p>Your order has been confirmed:</p>
        <ul>
            <li><strong>Order ID:</strong> ${order.id || 'N/A'}</li>
            <li><strong>Customer:</strong> ${order.customerName || 'N/A'}</li>
            <li><strong>Total Amount:</strong> $${order.totalAmount || 0}</li>
            <li><strong>Date:</strong> ${new Date(order.salesDate).toLocaleString()}</li>
        </ul>
        <p>Thank you for your business!</p>
    `
    return sendEmail(order.customerEmail || 'customer@example.com', subject, body)
}