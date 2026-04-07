import api from './api';

const alertsService = {
    // Get All Alerts - GET /api/alerts
    getAll: async () => {
        const response = await api.get('/alerts');
        return response.data;
    },

    // Get Low Stock Alerts - GET /api/alerts/low-stock
    getLowStock: async () => {
        const response = await api.get('/alerts/low-stock');
        return response.data;
    },

    // Get Alerts Summary - GET /api/alerts/summary
    getSummary: async () => {
        const response = await api.get('/alerts/summary');
        return response.data;
    }
};

export default alertsService;
