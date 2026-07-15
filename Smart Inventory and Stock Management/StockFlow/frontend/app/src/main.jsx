import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './dark-mode.css'  // We'll create this
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from './context/ThemeContext.jsx'

console.log('🚀 App starting...')

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)