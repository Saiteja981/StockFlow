import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme)
            applyTheme(savedTheme)
        }
    }, [])

    const applyTheme = (newTheme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)

        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
            document.body.style.backgroundColor = '#1a1a2e'
            document.body.style.color = '#ffffff'
        } else {
            document.documentElement.removeAttribute('data-theme')
            document.body.style.backgroundColor = '#f4f6f9'
            document.body.style.color = '#212529'
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        applyTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, applyTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}