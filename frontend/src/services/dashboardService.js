import api from './api';

export default {
    // Dashboard Stats - GET /api/dashboard/stats
    getStats: () => api.get('/dashboard/stats').then(r => r.data),

    // Dashboard Overview - GET /api/dashboard/overview
    getOverview: () => api.get('/dashboard/overview').then(r => r.data)
};
