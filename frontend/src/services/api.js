import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically inject authorization headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
};

export const carbonAPI = {
  logRecord: (data) => API.post('/carbon', data),
  getDashboard: () => API.get('/dashboard'),
  getSuggestions: () => API.get('/suggestions'),
  getChallenges: (page = 0) => API.get(`/challenges?page=${page}&size=5`),
};

export default API;