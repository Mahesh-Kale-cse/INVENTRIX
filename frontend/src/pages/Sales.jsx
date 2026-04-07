import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { salesService, productService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';
import { Plus, Calendar, DollarSign, ShoppingBag, Printer } from 'lucide-react';

export default function Sales() {
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [showPOS, setShowPOS] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterSales();
  }, [sales, searchQuery, dateFilter]);

  const loadData = async () => {
    try {
      const [salesData, productsData] = await Promise.all([
        salesService.getAll(),
        productService.getAll()
      ]);
      setSales(salesData);
      setProducts(productsData.filter(p => p.stockQuantity > 0));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterSales = () => {
    let filtered = [...sales];

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.id?.toString().includes(searchQuery) ||
        s.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFilter.start) {
      filtered = filtered.filter(s => new Date(s.saleDate) >= new Date(dateFilter.start));
    }

    if (dateFilter.end) {
      filtered = filtered.filter(s => new Date(s.saleDate) <= new Date(dateFilter.end));
    }

    setFilteredSales(filtered);
  };

  const addToCart = () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    if (quantity > product.stockQuantity) {
      toast.error('Insufficient stock');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity
      }]);
    }

    setSelectedProduct('');
    setQuantity(1);
    toast.success('Added to cart');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      // ✅ FIX: Backend SalesRequest expects { productId, quantity } per item
      // Old code sent a single object with items/totalAmount/saleDate — wrong shape
      // Now sending array to /api/sales/bulk which handles multiple items correctly
      const requests = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      await salesService.recordBulkSales(requests);
      toast.success('Sale recorded successfully!');
      setCart([]);
      setShowPOS(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record sale');
    }
  };

  const columns = [
    {
      header: 'Sale ID',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: '600' }}>#{row.id}</span>
    },
    {
      header: 'Product',
      accessor: 'productName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {row.productName || row.product?.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Qty: {row.quantitySold || row.quantity}
          </div>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'saleDate',
      render: (row) => new Date(row.saleDate).toLocaleDateString()
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (row) => (
        <span style={{ fontWeight: 'bold', color: 'var(--success-500)' }}>
          ${row.totalAmount || (row.unitPrice * row.quantitySold)}
        </span>
      )
    },
    {
      header: 'Sold By',
      accessor: 'user',
      render: (row) => row.user?.username || user?.username || 'N/A'
    }
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
            Sales
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filteredSales.length} total sales
          </p>
        </div>
        {(isAdmin() || user?.roles?.includes('STAFF')) && (
          <button onClick={() => setShowPOS(true)} className="btn-primary">
            <Plus size={20} />
            New Sale
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-lg)'
      }}>
        <div className="card-compact card" style={{ borderLeft: '4px solid var(--success-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
            Total Sales
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {sales.length}
          </div>
        </div>
        <div className="card-compact card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            ${sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-md)'
        }}>
          <div>
            <label className="form-label">Search</label>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by ID or product..."
            />
          </div>
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <DataTable
        columns={columns}
        data={filteredSales}
        emptyMessage="No sales recorded yet"
      />

      {/* POS Modal */}
      {showPOS && (
        <Modal
          isOpen={showPOS}
          onClose={() => { setShowPOS(false); setCart([]); }}
          title="Point of Sale"
          size="lg"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
            {/* Product Selection */}
            <div>
              <h4 style={{ marginBottom: 'var(--space-md)', fontWeight: 'bold' }}>Add Products</h4>
              <div className="form-group">
                <label className="form-label">Select Product</label>
                <select
                  className="form-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Choose a product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${p.price} (Stock: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <button onClick={addToCart} className="btn-primary" style={{ width: '100%' }}>
                <Plus size={18} />
                Add to Cart
              </button>
            </div>

            {/* Cart */}
            <div>
              <h4 style={{ marginBottom: 'var(--space-md)', fontWeight: 'bold' }}>Cart</h4>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: 'var(--space-md)'
              }}>
                {cart.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
                    Cart is empty
                  </p>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.productId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--space-md)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-sm)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          ${item.price} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <span style={{ fontWeight: 'bold' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="btn-icon btn-ghost"
                          style={{ color: 'var(--error-500)' }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total */}
              <div style={{
                padding: 'var(--space-lg)',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-md)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Total:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-600)' }}>
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={processSale}
                className="btn-success"
                style={{ width: '100%' }}
                disabled={cart.length === 0}
              >
                <ShoppingBag size={18} />
                Complete Sale
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}