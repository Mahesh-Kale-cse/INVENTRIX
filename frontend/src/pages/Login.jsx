import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Package, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(creds);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md)',
            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)'
          }}>
            <Package size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: 'var(--space-xs)',
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            INVENTRIX
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your account</p>
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
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              className="form-input"
              placeholder="Enter your username"
              autoComplete="username"
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
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              className="form-input"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-md)' }}
          >
            <LogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>



        {/* Footer */}
        <div style={{
          marginTop: 'var(--space-xl)',
          textAlign: 'center',
          paddingTop: 'var(--space-lg)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary-500)',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
