export const validateCardNumber = (number) => {
    // Remove spaces and dashes
    const clean = number.replace(/[\s-]/g, '')

    // Luhn algorithm validation
    let sum = 0
    let isEven = false
    for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean.charAt(i), 10)
        if (isEven) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
        isEven = !isEven
    }
    return sum % 10 === 0 && clean.length >= 13 && clean.length <= 19
}

export const validateExpiry = (month, year) => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear() % 100

    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false
    if (month < 1 || month > 12) return false

    return true
}

export const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
}

export const getCardType = (number) => {
    const clean = number.replace(/[\s-]/g, '')

    if (/^4/.test(clean)) return 'visa'
    if (/^5[1-5]/.test(clean)) return 'mastercard'
    if (/^3[47]/.test(clean)) return 'amex'
    if (/^6(?:011|5)/.test(clean)) return 'discover'
    if (/^3(?:0[0-5]|[68])/.test(clean)) return 'dinersclub'
    if (/^(?:2131|1800|35)/.test(clean)) return 'jcb'

    return 'unknown'
}

export const formatCurrency = (amount) => {
    return '$' + parseFloat(amount || 0).toFixed(2)
}