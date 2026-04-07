import { useState, useEffect } from 'react';
import { productService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const products = await productService.getLowStock();
      setLowStockProducts(products);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-xs)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)'
        }}>
          <AlertTriangle size={32} style={{ color: 'var(--warning-500)' }} />
          Alerts & Notifications
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {lowStockProducts.length} active alerts requiring attention
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)'
      }}>
        <div className="card" style={{ borderLeft: '4px solid var(--error-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
            Critical Alerts
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--error-500)' }}>
            {lowStockProducts.filter(p => p.stockQuantity === 0).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Out of stock items
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
            Warning Alerts
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-500)' }}>
            {lowStockProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.reorderLevel).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Low stock items
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--info-500)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
            Total Alerts
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info-500)' }}>
            {lowStockProducts.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Requires action
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {lowStockProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>✅</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
            All Clear!
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            No alerts at this time. All products are well stocked.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {lowStockProducts.map(product => {
            const isOutOfStock = product.stockQuantity === 0;
            const alertType = isOutOfStock ? 'error' : 'warning';
            const alertTitle = isOutOfStock ? '🚨 Out of Stock' : '⚠️ Low Stock Warning';

            return (
              <Alert
                key={product.id}
                type={alertType}
                title={alertTitle}
                message={
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-sm)', fontSize: '0.875rem' }}>
                      <div>
                        <strong>Current Stock:</strong> {product.stockQuantity}
                      </div>
                      <div>
                        <strong>Reorder Level:</strong> {product.reorderLevel}
                      </div>
                      <div>
                        <strong>Category:</strong> {product.category?.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Price:</strong> ${product.price}
                      </div>
                    </div>
                    {isOutOfStock && (
                      <div style={{
                        marginTop: 'var(--space-sm)',
                        padding: 'var(--space-sm)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem'
                      }}>
                        <strong>Action Required:</strong> Immediate restocking needed to avoid sales loss
                      </div>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
