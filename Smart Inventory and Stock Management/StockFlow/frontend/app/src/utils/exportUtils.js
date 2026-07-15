export const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch (e) {
        return 'N/A'
    }
}

export const formatCurrency = (amount) => {
    return '$' + parseFloat(amount || 0).toFixed(2)
}

export const getFileName = (prefix) => {
    const date = new Date().toISOString().split('T')[0]
    return `${prefix}-${date}`
}

export const formatCurrencyForExport = (amount) => {
    return parseFloat(amount || 0).toFixed(2)
}