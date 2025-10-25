import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

// ✅ Auth API
export const authAPI = {
  signin: (email, password) =>
    api.post('/auth/signin', { email, password }),

  signup: (userData) =>
    api.post('/auth/signup', userData),

  getMe: () =>
    api.get('/auth/me'),
};

// ✅ Transactions API
export const transactionsAPI = {
  create: (transactionData) =>
    api.post('/transactions', transactionData),

  getAll: (month, year) =>
    api.get(`/transactions?month=${month}&year=${year}`),

  delete: (id) =>
    api.delete(`/transactions/${id}`),
};

// ✅ Dashboard API
export const dashboardAPI = {
  getData: () =>
    api.get('/dashboard'),
};

export default api;

