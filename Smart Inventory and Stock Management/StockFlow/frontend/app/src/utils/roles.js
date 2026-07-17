// Role definitions
export const ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    USER: 'User'
}

// Role-based permissions
export const PERMISSIONS = {
    [ROLES.ADMIN]: {
        dashboard: true,
        analytics: true,
        products: true,
        purchase: true,
        sales: true,
        customers: true,
        bulkImport: true,
        barcode: true,
        forecasting: true,
        stockReport: true,
        reorderSettings: true,
        suppliers: true,
        paymentGateway: true,
        users: true,
        settings: true,
        profitLoss: true,      // ✅ Added
        '2fa': true            // ✅ Added
    },
    [ROLES.MANAGER]: {
        dashboard: true,
        analytics: true,
        products: true,
        purchase: true,
        sales: true,
        customers: false,
        bulkImport: false,
        barcode: true,
        forecasting: false,
        stockReport: true,
        reorderSettings: true,
        suppliers: true,
        paymentGateway: false,
        users: false,
        settings: false,
        profitLoss: true,      // ✅ Added (Managers can view P&L)
        '2fa': false           // ✅ Added (Managers don't have 2FA)
    },
    [ROLES.USER]: {
        dashboard: true,
        analytics: false,
        products: true,
        purchase: false,
        sales: true,
        customers: false,
        bulkImport: false,
        barcode: false,
        forecasting: false,
        stockReport: false,
        reorderSettings: false,
        suppliers: false,
        paymentGateway: false,
        users: false,
        settings: false,
        profitLoss: false,     // ✅ Added
        '2fa': false           // ✅ Added
    }
}

// Permission check
export const hasPermission = (userRole, permission) => {
    const userPermissions = PERMISSIONS[userRole] || PERMISSIONS[ROLES.USER]
    return userPermissions[permission] || false
}

// Get user role from localStorage
export const getUserRole = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
        try {
            const user = JSON.parse(userData)
            return user.role || ROLES.USER
        } catch (e) {
            return ROLES.USER
        }
    }
    return ROLES.USER
}

// Get user name from localStorage
export const getUserName = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
        try {
            const user = JSON.parse(userData)
            return user.name || 'User'
        } catch (e) {
            return 'User'
        }
    }
    return 'User'
}

// Get user email from localStorage
export const getUserEmail = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
        try {
            const user = JSON.parse(userData)
            return user.email || ''
        } catch (e) {
            return ''
        }
    }
    return ''
}

// Role checks
export const isAdmin = () => {
    return getUserRole() === ROLES.ADMIN
}

export const isManager = () => {
    return getUserRole() === ROLES.MANAGER
}

export const isAdminOrManager = () => {
    const role = getUserRole()
    return role === ROLES.ADMIN || role === ROLES.MANAGER
}

// ✅ Get all permissions for a role
export const getPermissions = (role) => {
    return PERMISSIONS[role] || PERMISSIONS[ROLES.USER]
}

// ✅ Check if user has any of the given permissions
export const hasAnyPermission = (userRole, permissions) => {
    return permissions.some(permission => hasPermission(userRole, permission))
}

// ✅ Check if user has all of the given permissions
export const hasAllPermissions = (userRole, permissions) => {
    return permissions.every(permission => hasPermission(userRole, permission))
}

// ✅ Get role display info
export const getRoleInfo = (role) => {
    const roleInfo = {
        'Admin': { label: 'Admin', color: 'danger', icon: '👑' },
        'Manager': { label: 'Manager', color: 'warning', icon: '📋' },
        'User': { label: 'User', color: 'info', icon: '👤' }
    }
    return roleInfo[role] || roleInfo['User']
}

// ✅ Get all features for a role
export const getFeatures = (role) => {
    const permissions = PERMISSIONS[role] || PERMISSIONS[ROLES.USER]
    return Object.keys(permissions).filter(key => permissions[key] === true)
}