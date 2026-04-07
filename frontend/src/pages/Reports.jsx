import { useState, useEffect } from 'react';
import { salesService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      // ✅ FIX: Removed salesService.getRevenue() from Promise.all
      // That call sent ISO strings but backend expects LocalDateTime params → 400 error
      // which caused Promise.all to reject and crash the ENTIRE page.
      // Revenue bar chart already uses monthlyData so nothing visual is lost.
      const [topProds, catPerf, monthly] = await Promise.all([
        salesService.getTopProducts(),
        salesService.getCategoryPerformance(),
        salesService.getMonthly()
      ]);

      setTopProducts(topProds);
      setCategoryPerformance(catPerf.categories || []);
      setMonthlyData(monthly);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    let data, headers, filename;

    switch (type) {
      case 'revenue':
        // ✅ FIX: Revenue export now uses monthlyData instead of broken revenue state
        headers = ['Month', 'Revenue', 'Sales'];
        data = monthlyData.map(r => [r.month, r.revenue, r.sales]);
        filename = 'revenue_report';
        break;
      case 'products':
        headers = ['Product', 'Quantity Sold', 'Revenue'];
        data = topProducts.map(p => [p.name || p.productName, p.quantity || p.soldQuantity, p.revenue || 0]);
        filename = 'top_products_report';
        break;
      case 'category':
        headers = ['Category', 'Sales'];
        data = categoryPerformance.map(c => [c.name, c.value]);
        filename = 'category_performance_report';
        break;
      default:
        return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Report exported successfully!');
  };

  if (loading) return <LoadingSpinner />;

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-xs)'
        }}>
          Reports & Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Revenue Report */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-lg)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <DollarSign size={20} style={{ color: 'var(--success-500)' }} />
            Revenue Report
          </h3>
          <button onClick={() => exportReport('revenue')} className="btn-secondary btn-sm">
            <Download size={16} />
            Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
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
            <Bar dataKey="revenue" fill="var(--success-500)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-lg)'
      }}>
        {/* Top Products */}
        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-lg)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)'
            }}>
              <TrendingUp size={20} style={{ color: 'var(--primary-500)' }} />
              Top Selling Products
            </h3>
            <button onClick={() => exportReport('products')} className="btn-secondary btn-sm">
              <Download size={16} />
              Export
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {topProducts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
                No sales data yet
              </p>
            ) : topProducts.slice(0, 5).map((product, idx) => (
              <div
                key={idx}
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
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: `linear-gradient(135deg, ${COLORS[idx % COLORS.length]}, ${COLORS[(idx + 1) % COLORS.length]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {product.name || product.productName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {product.quantity || product.soldQuantity || 0} units sold
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--success-500)' }}>
                  ${product.revenue || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-lg)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)'
            }}>
              Category Performance
            </h3>
            <button onClick={() => exportReport('category')} className="btn-secondary btn-sm">
              <Download size={16} />
              Export
            </button>
          </div>
          {categoryPerformance.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-lg)' }}>
              No category data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)'
        }}>
          <Calendar size={20} style={{ color: 'var(--info-500)' }} />
          Monthly Sales Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
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
              dataKey="sales"
              stroke="var(--primary-500)"
              strokeWidth={3}
              dot={{ fill: 'var(--primary-500)', r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--success-500)"
              strokeWidth={3}
              dot={{ fill: 'var(--success-500)', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}