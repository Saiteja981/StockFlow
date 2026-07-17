// Currency configurations
export const CURRENCIES = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        locale: 'en-US',
        rate: 1,
        format: 'en-US'
    },
    INR: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
        locale: 'en-IN',
        rate: 83.50,
        format: 'en-IN'
    },
    EUR: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        locale: 'de-DE',
        rate: 0.92,
        format: 'de-DE'
    },
    GBP: {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound',
        locale: 'en-GB',
        rate: 0.79,
        format: 'en-GB'
    },
    JPY: {
        code: 'JPY',
        symbol: '¥',
        name: 'Japanese Yen',
        locale: 'ja-JP',
        rate: 149.50,
        format: 'ja-JP'
    },
    AUD: {
        code: 'AUD',
        symbol: 'A$',
        name: 'Australian Dollar',
        locale: 'en-AU',
        rate: 1.52,
        format: 'en-AU'
    },
    CAD: {
        code: 'CAD',
        symbol: 'C$',
        name: 'Canadian Dollar',
        locale: 'en-CA',
        rate: 1.36,
        format: 'en-CA'
    },
    SGD: {
        code: 'SGD',
        symbol: 'S$',
        name: 'Singapore Dollar',
        locale: 'en-SG',
        rate: 1.34,
        format: 'en-SG'
    }
}

// ✅ Format currency
export const formatCurrency = (amount, currencyCode = 'USD', showSymbol = true) => {
    const currency = CURRENCIES[currencyCode] || CURRENCIES.USD

    try {
        const formatted = new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount)

        return formatted
    } catch (e) {
        const symbol = showSymbol ? currency.symbol : ''
        return `${symbol}${parseFloat(amount || 0).toFixed(2)}`
    }
}

// ✅ NEW: Format date
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

// ✅ Convert currency
export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'INR') => {
    const fromRate = CURRENCIES[fromCurrency]?.rate || 1
    const toRate = CURRENCIES[toCurrency]?.rate || 1
    const usdAmount = amount / fromRate
    return usdAmount * toRate
}

// ✅ Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
    return CURRENCIES[currencyCode]?.symbol || '$'
}

// ✅ Get all currency options
export const getCurrencyOptions = () => {
    return Object.values(CURRENCIES).map(currency => ({
        value: currency.code,
        label: `${currency.symbol} ${currency.code} - ${currency.name}`
    }))
}

// ✅ Save currency preference
export const saveCurrencyPreference = (currencyCode) => {
    localStorage.setItem('preferredCurrency', currencyCode)
}

// ✅ Get saved currency preference
export const getSavedCurrency = () => {
    return localStorage.getItem('preferredCurrency') || 'USD'
}

// ✅ Format price range
export const formatPriceRange = (minPrice, maxPrice, currencyCode = 'USD') => {
    if (!minPrice && !maxPrice) return 'Any'
    if (minPrice && maxPrice) {
        return `${formatCurrency(minPrice, currencyCode)} - ${formatCurrency(maxPrice, currencyCode)}`
    }
    if (minPrice) return `Min ${formatCurrency(minPrice, currencyCode)}`
    if (maxPrice) return `Max ${formatCurrency(maxPrice, currencyCode)}`
    return 'Any'
}