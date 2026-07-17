import { toast } from 'react-toastify'

// Simulated notification service
// Replace with actual API calls to Twilio, SendGrid, etc.

export const sendWhatsAppMessage = async (to, message) => {
    console.log('📱 Sending WhatsApp message...')
    console.log('To:', to)
    console.log('Message:', message)

    // In production, use Twilio WhatsApp API:
    // const response = await axios.post('/api/whatsapp/send', { to, message })

    return new Promise((resolve) => {
        setTimeout(() => {
            toast.success(`📱 WhatsApp sent to ${to}`)
            resolve({ success: true })
        }, 1500)
    })
}

export const sendEmail = async (to, subject, body) => {
    console.log('📧 Sending email...')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Body:', body)

    // In production, use SendGrid or AWS SES:
    // const response = await axios.post('/api/email/send', { to, subject, body })

    return new Promise((resolve) => {
        setTimeout(() => {
            toast.success(`📧 Email sent to ${to}`)
            resolve({ success: true })
        }, 1500)
    })
}

export const sendLowStockAlert = async (product, stock) => {
    const message = `⚠️ Low Stock Alert!\nProduct: ${product.name || product.productName}\nCurrent Stock: ${stock}\nPlease restock as soon as possible.`

    // Send to admin via WhatsApp
    await sendWhatsAppMessage('+1234567890', message)

    // Send to admin via Email
    await sendEmail('admin@example.com', 'Low Stock Alert', `
        <h2>Low Stock Alert</h2>
        <p><strong>Product:</strong> ${product.name || product.productName}</p>
        <p><strong>Current Stock:</strong> ${stock}</p>
        <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
        <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
        <p>Please restock as soon as possible.</p>
    `)

    return { success: true }
}

export const sendOrderConfirmation = async (order) => {
    const message = `✅ Order Confirmed!\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: $${order.totalAmount}\nThank you for your business!`

    await sendWhatsAppMessage(order.customerPhone || '+1234567890', message)
    await sendEmail(order.customerEmail || 'customer@example.com', 'Order Confirmed', `
        <h2>Order Confirmation</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
        <p>Thank you for your business!</p>
    `)

    return { success: true }
}

export const sendWelcomeEmail = async (user) => {
    await sendEmail(user.email, 'Welcome to Smart Inventory!', `
        <h2>Welcome ${user.name}!</h2>
        <p>Thank you for registering with Smart Inventory and Stock Management.</p>
        <p>You can now start managing your inventory efficiently.</p>
    `)
    return { success: true }
}