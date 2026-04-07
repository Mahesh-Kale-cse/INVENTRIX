import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService, categoryService } from '../services'; // ✅ FIX 1: Added categoryService import
import ProductForm from '../components/ProductForm';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Filter, Download, TrendingUp } from 'lucide-react';

export default function Products() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);

      // ✅ FIX 2: Load categories directly from API instead of extracting from products
      const cats = await categoryService.getAll();
      setCategories(cats); // cats = [{id, name}, ...]
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category?.name === categoryFilter);
    }

    // Stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(p => p.stockQuantity <= p.reorderLevel);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(p => p.stockQuantity === 0);
    } else if (stockFilter === 'in') {
      filtered = filtered.filter(p => p.stockQuantity > p.reorderLevel);
    }

    setFilteredProducts(filtered);
  };

  const handleSave = async (data) => {
    try {
      if (editProduct?.id) {
        await productService.update(editProduct.id, data);
        toast.success('Product updated successfully!');
      } else {
        await productService.create(data);
        toast.success('Product created successfully!');
      }
      setShowForm(false);
      setEditProduct(null);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        toast.success('Product deleted successfully!');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Reorder Level'];
    const rows = filteredProducts.map(p => [
      p.id,
      p.name,
      p.category?.name || 'N/A',
      p.price,
      p.stockQuantity,
      p.reorderLevel
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Products exported successfully!');
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          {row.description && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {row.description.substring(0, 50)}{row.description.length > 50 ? '...' : ''}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="badge-info">
          {row.category?.name || 'Uncategorized'}
        </span>
      )
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => (
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          ${row.price}
        </span>
      )
    },
    {
      header: 'Stock',
      accessor: 'stockQuantity',
      render: (row) => {
        const isLow = row.stockQuantity <= row.reorderLevel;
        const isOut = row.stockQuantity === 0;
        return (
          <span className={isOut ? 'badge-error' : isLow ? 'badge-warning' : 'badge-success'}>
            {row.stockQuantity} {isOut ? '(Out)' : isLow ? '(Low)' : ''}
          </span>
        );
      }
    },
    ...(isAdmin() ? [{
      header: 'Actions',
      accessor: 'actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { setEditProduct(row); setShowForm(true); }}
            className="btn-icon btn-secondary"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn-icon btn-ghost"
            style={{ color: 'var(--error-500)' }}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }] : [])
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-xl)',
        flexWrap: 'wrap',
        gap: 'var(--space-md)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-xs)'
          }}>
            Products
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button onClick={exportToCSV} className="btn-secondary">
            <Download size={18} />
            Export CSV
          </button>
          {isAdmin() && (
            <button
              onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="btn-primary"
            >
              <Plus size={20} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-md)',
          alignItems: 'end'
        }}>
          <div>
            <label className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
              <Filter size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Search
            </label>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {/* ✅ FIX 3: Use cat.id and cat.name since categories are now objects */}
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Stock Status</label>
            <select
              className="form-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 && !loading ? (
        <EmptyState
          icon="📦"
          title="No products found"
          description={searchQuery || categoryFilter !== 'all' || stockFilter !== 'all'
            ? "Try adjusting your filters"
            : "Start by adding your first product"}
          action={isAdmin() && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={20} />
              Add Product
            </button>
          )}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProducts}
          loading={loading}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          title={editProduct ? 'Edit Product' : 'Add New Product'}
          size="lg"
        >
          <ProductForm
            product={editProduct}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditProduct(null); }}
          />
        </Modal>
      )}
    </div>
  );
}