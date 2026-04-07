import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService, salesService, dashboardService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, ShoppingCart, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    loadData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadData(true);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const [dashStats, lowStock, monthlyData, categoryData, topProds] = await Promise.all([
        salesService.getDashboard(),
        productService.getLowStock(),
        salesService.getMonthly(),
        salesService.getCategoryPerformance(),
        salesService.getTopProducts()
      ]);

      setStats(dashStats);
      setLowStockProducts(lowStock.slice(0, 5));
      setMonthly(monthlyData.slice(-6));
      setCategoryPerformance(categoryData.categories?.slice(0, 5) || []);
      setTopProducts(topProds.slice(0, 5));

      if (silent) toast.success('Dashboard refreshed!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-xl)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-xs)',
            color: 'var(--text-primary)'
          }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>
            Welcome back, {user?.fullName || user?.username}! 👋
          </p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)'
      }}>
        <StatCard
          icon={<Package size={24} />}
          label="Total Products"
          value={stats.totalProducts || 0}
          color="var(--primary-500)"
          trend={stats.productsTrend}
        />
        <StatCard
          icon={<AlertTriangle size={24} />}
          label="Low Stock Items"
          value={stats.lowStockItems || 0}
          color="var(--error-500)"
        />
        <StatCard
          icon={<ShoppingCart size={24} />}
          label="Today's Sales"
          value={stats.todaySalesCount || 0}
          subValue={`$${stats.todaySales || 0}`}
          color="var(--success-500)"
          trend={stats.salesTodayTrend}
        />
        <StatCard
          icon={<DollarSign size={24} />}
          label="Total Revenue"
          value={`$${Math.round(stats.totalRevenue || 0).toLocaleString()}`}
          color="var(--secondary-500)"
          trend={stats.revenueTrend}
        />
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)'
      }}>
        {/* Monthly Sales Trend */}
        <div className="card">
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <TrendingUp size={20} style={{ color: 'var(--primary-500)' }} />
            Monthly Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary-500)"
                strokeWidth={3}
                dot={{ fill: 'var(--primary-500)', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="var(--success-500)"
                strokeWidth={3}
                dot={{ fill: 'var(--success-500)', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="card">
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)'
          }}>
            Category Performance
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        {/* Top Selling Products */}
        <div className="card">
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)'
          }}>
            Top Selling Products
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {topProducts.length > 0 ? topProducts.map((product, idx) => (
              <div
                key={product.id || idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: `linear-gradient(135deg, ${COLORS[idx % COLORS.length]}, ${COLORS[(idx + 1) % COLORS.length]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {product.name || product.productName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {product.soldQuantity || product.quantity} sold
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary-500)', fontSize: '1.125rem' }}>
                  ${product.revenue || (product.price * product.quantity)}
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
                No sales data available
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-lg)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <AlertTriangle size={20} style={{ color: 'var(--error-500)' }} />
            Low Stock Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-md)',
                  background: 'var(--error-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--error-500)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Reorder Level: {product.reorderLevel}
                  </div>
                </div>
                <div>
                  <span className="badge-error" style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                    {product.stockQuantity} left
                  </span>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
                All products are well stocked! ✅
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
