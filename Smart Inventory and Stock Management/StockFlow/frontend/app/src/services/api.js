import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Product APIs
export const productApi = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (product) => api.post('/products', product),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: (id) => api.delete(`/products/${id}`),
    updateStock: (id, quantity) => api.patch(`/products/${id}/stock?quantity=${quantity}`),
};

// Purchase APIs
export const purchaseApi = {
    getAll: () => api.get('/purchases'),
    create: (purchase) => api.post('/purchases', purchase),
};

// Sales APIs
export const salesApi = {
    getAll: () => api.get('/sales'),
    create: (sale) => api.post('/sales', sale),
};

export default api;