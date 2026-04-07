import axios from 'axios';

// ✅ FIXED: reads from .env — set REACT_APP_API_URL=http://localhost:8080/api in frontend/.env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;