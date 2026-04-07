import api from './api';

export default {
  // Get All Products - GET /api/products
  getAll: () => api.get('/products').then(r => r.data),

  // Get Product By ID - GET /api/products/{id}
  getById: (id) => api.get('/products/' + id).then(r => r.data),

  // Create Product (ADMIN) - POST /api/products
  create: (data) => api.post('/products', data).then(r => r.data),

  // Update Product (ADMIN) - PUT /api/products/{id}
  update: (id, data) => api.put('/products/' + id, data).then(r => r.data),

  // Delete Product (ADMIN) - DELETE /api/products/{id}
  delete: (id) => api.delete('/products/' + id).then(r => r.data),

  // Low Stock Products - GET /api/products/low-stock
  getLowStock: () => api.get('/products/low-stock').then(r => r.data),

  // Search Products - GET /api/products/search?q=keyword
  search: (keyword) => api.get('/products/search', { params: { q: keyword } }).then(r => r.data),

  // Top Selling Products - GET /api/products/top-selling
  getTopSelling: () => api.get('/products/top-selling').then(r => r.data),

  // Products By Category - GET /api/products/category/{categoryId}
  getByCategory: (categoryId) => api.get('/products/category/' + categoryId).then(r => r.data),

  // Update Stock (ADMIN/STAFF) - PATCH /api/products/{id}/stock
  updateStock: (id, stockData) => api.patch('/products/' + id + '/stock', stockData).then(r => r.data),

  // Product Statistics - GET /api/products/stats
  getStats: () => api.get('/products/stats').then(r => r.data)
};