import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Package } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'var(--space-lg)'
    }}>
      <div className="card animate-fadeIn" style={{
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md)',
            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)'
          }}>
            <Package size={36} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-xs)',
            color: 'var(--text-primary)'
          }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join INVENTRIX today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Username
            </label>
            <input
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="form-input"
              placeholder="Enter your username"
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Full Name
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Password
            </label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-input"
              placeholder="Create a password (min 6 characters)"
              minLength={6}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Password must be at least 6 characters long
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-md)' }}
          >
            {loading ? 'Creating Account...' : 'Register →'}
          </button>
        </form>

        {/* Info */}
        <div style={{
          marginTop: 'var(--space-lg)',
          padding: 'var(--space-md)',
          background: 'var(--info-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--info-200)'
        }}>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--info-700)',
            margin: 0
          }}>
            ℹ️ New accounts are created with <strong>STAFF</strong> role by default
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'var(--space-xl)',
          textAlign: 'center',
          paddingTop: 'var(--space-lg)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary-500)',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
