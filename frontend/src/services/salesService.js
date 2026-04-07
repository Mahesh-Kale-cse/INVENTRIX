import api from './api';

export default {
  // Record Single Sale (ADMIN/STAFF) - POST /api/sales
  recordSale: (saleData) => api.post('/sales', saleData).then(r => r.data),

  // Record Bulk Sales (ADMIN/STAFF) - POST /api/sales/bulk
  recordBulkSales: (salesData) => api.post('/sales/bulk', salesData).then(r => r.data),

  // Get All Sales - GET /api/sales
  getAll: () => api.get('/sales').then(r => r.data),

  // Get Sale By ID - GET /api/sales/{id}
  getById: (id) => api.get('/sales/' + id).then(r => r.data),

  // Sales By Date Range - GET /api/sales/date-range
  getByDateRange: (startDate, endDate) =>
    api.get('/sales/date-range', { params: { startDate, endDate } }).then(r => r.data),

  // Dashboard Sales Stats - GET /api/sales/dashboard
  getDashboard: () => api.get('/sales/dashboard').then(r => r.data),

  // Monthly Sales Data - GET /api/sales/monthly
  getMonthly: () => api.get('/sales/monthly').then(r => r.data),

  // Revenue Report - GET /api/sales/revenue
  getRevenue: (startDate, endDate) =>
    api.get('/sales/revenue', { params: { start: startDate, end: endDate } }).then(r => r.data),

  // Sales Prediction - GET /api/sales/prediction
  getPrediction: () => api.get('/sales/prediction').then(r => r.data),

  // Top Selling Products (Sales) - GET /api/sales/top-products
  getTopProducts: () => api.get('/sales/top-products').then(r => r.data),

  // Category Performance - GET /api/sales/category-performance
  getCategoryPerformance: () => api.get('/sales/category-performance').then(r => r.data)
};
