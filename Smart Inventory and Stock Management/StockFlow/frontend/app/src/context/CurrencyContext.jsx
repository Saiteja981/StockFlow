import React, { createContext, useState, useContext, useEffect } from 'react'
import { getSavedCurrency, saveCurrencyPreference, CURRENCIES } from '../utils/currencyUtils'

const CurrencyContext = createContext()

export const useCurrency = () => {
    const context = useContext(CurrencyContext)
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider')
    }
    return context
}

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD')
    const [rates, setRates] = useState({})

    useEffect(() => {
        // Load saved currency preference
        const saved = getSavedCurrency()
        if (saved && CURRENCIES[saved]) {
            setCurrency(saved)
        }
        // Load exchange rates (simulated)
        loadRates()
    }, [])

    const loadRates = () => {
        // In production, fetch from API
        const rateData = {}
        Object.keys(CURRENCIES).forEach(code => {
            rateData[code] = CURRENCIES[code].rate
        })
        setRates(rateData)
    }

    const changeCurrency = (newCurrency) => {
        if (CURRENCIES[newCurrency]) {
            setCurrency(newCurrency)
            saveCurrencyPreference(newCurrency)
        }
    }

    const getSymbol = () => {
        return CURRENCIES[currency]?.symbol || '$'
    }

    const getCurrencyInfo = () => {
        return CURRENCIES[currency] || CURRENCIES.USD
    }

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency: changeCurrency,
            getSymbol,
            getCurrencyInfo,
            rates,
            currencies: CURRENCIES
        }}>
            {children}
        </CurrencyContext.Provider>
    )
}