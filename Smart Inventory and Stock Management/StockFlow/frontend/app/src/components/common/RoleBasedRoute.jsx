import React from 'react'
import { Navigate } from 'react-router-dom'
import { hasPermission, getUserRole } from '../../utils/roles'

const RoleBasedRoute = ({ children, permission }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const userRole = getUserRole()

    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }

    if (permission && !hasPermission(userRole, permission)) {
        // Redirect to dashboard with access denied message
        return <Navigate to="/" />
    }

    return children
}

export default RoleBasedRoute