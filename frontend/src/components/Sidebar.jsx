import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, TrendingUp, AlertTriangle, Activity, FileText, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/sales', icon: TrendingUp, label: 'Sales' },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { to: '/predictions', icon: Activity, label: 'Predictions' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: '280px',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-xl)',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)'
        }}>
          <Package size={32} />
        </div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #fff 0%, #a5b8fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.25rem'
        }}>
          INVENTRIX
        </h1>
        <p style={{
          fontSize: '0.75rem',
          color: '#8b8b8b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600'
        }}>
          {user?.roles?.[0] || 'USER'}
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
              marginBottom: '0.5rem',
              background: isActive ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)' : 'transparent',
              border: isActive ? '1px solid rgba(102, 126, 234, 0.5)' : '1px solid transparent',
              fontWeight: isActive ? '600' : '500',
              fontSize: '0.9375rem',
              transition: 'all var(--transition-fast)'
            })}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div style={{
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '0.9375rem',
            marginBottom: '0.25rem',
            color: 'white'
          }}>
            {user?.fullName || user?.username}
          </div>
          <div style={{
            fontSize: '0.8125rem',
            color: '#8b8b8b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-danger"
          style={{
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
