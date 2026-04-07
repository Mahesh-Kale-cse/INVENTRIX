import api from './api';
export default {
  getProfile: () => api.get('/auth/profile').then(r => r.data)
};
