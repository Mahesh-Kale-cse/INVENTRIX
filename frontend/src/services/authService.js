import api from './api';

export default {
  // Register User - POST /api/auth/register
  async register(data) { 
    return (await api.post('/auth/register', data)).data; 
  },

  // Login User - POST /api/auth/login
  async login(creds) {
    const res = await api.post('/auth/login', creds);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  // Get Profile - GET /api/auth/profile
  async getProfile() {
    return (await api.get('/auth/profile')).data;
  },

  // ✅ FIX: Added missing updateProfile method - PUT /api/auth/profile
  // Profile.jsx calls this but it didn't exist → TypeError crash
  async updateProfile(data) {
    return (await api.put('/auth/profile', data)).data;
  },

  // ✅ FIX: Added missing changePassword method - PUT /api/auth/change-password
  // Profile.jsx calls this but it didn't exist → TypeError crash
  async changePassword(data) {
    return (await api.put('/auth/change-password', data)).data;
  },

  // Logout User - POST /api/auth/logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser() { 
    const u = localStorage.getItem('user'); 
    return u ? JSON.parse(u) : null; 
  }
};