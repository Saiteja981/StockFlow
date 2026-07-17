import React, { useState } from 'react'
import { FaDollarSign, FaChevronDown } from 'react-icons/fa'
import { useCurrency } from '../../context/CurrencyContext'
import { CURRENCIES, getCurrencySymbol } from '../../utils/currencyUtils'

const CurrencySelector = () => {
    const { currency, setCurrency } = useCurrency()
    const [isOpen, setIsOpen] = useState(false)

    const currencies = Object.keys(CURRENCIES)

    const handleSelect = (code) => {
        setCurrency(code)
        setIsOpen(false)
    }

    const currentCurrency = CURRENCIES[currency]

    return (
        <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    background: 'transparent',
                    color: 'white'
                }}
            >
                <span>{currentCurrency?.symbol || '$'}</span>
                <span>{currency}</span>
                <FaChevronDown size={10} />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        minWidth: '160px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: '8px 0',
                        zIndex: 1000,
                        marginTop: '5px'
                    }}
                >
                    {currencies.map((code) => {
                        const info = CURRENCIES[code]
                        const isActive = currency === code
                        return (
                            <button
                                key={code}
                                onClick={() => handleSelect(code)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 20px',
                                    border: 'none',
                                    background: isActive ? '#f0f0f0' : 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    color: isActive ? '#007bff' : '#333',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    fontSize: '14px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.target.style.backgroundColor = '#f8f9fa'
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.target.style.backgroundColor = 'transparent'
                                }}
                            >
                                {info.symbol} {code} - {info.name}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Click outside to close */}
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

export default CurrencySelector