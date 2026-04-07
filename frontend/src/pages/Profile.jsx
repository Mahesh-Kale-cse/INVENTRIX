import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { User, Mail, Shield, Key, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      // Update local storage and context
      // Note: backend returns the updated user object
      const fullUser = { ...user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      if (error.response?.status === 409) {
        toast.error(msg);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setChangingPassword(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangingPassword(false);
    } catch (error) {
      setChangingPassword(false);
      // Prioritize the server's error message
      const serverMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : '');
      toast.error(serverMsg || 'Failed to change password. Please check your current password.');
    }
  };

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
          <User size={32} style={{ color: 'var(--primary-500)' }} />
          Profile Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your account information and preferences
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        {/* Profile Information */}
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
              <User size={20} />
              Personal Information
            </h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary btn-sm">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      fullName: user?.fullName || '',
                      email: user?.email || '',
                      username: user?.username || ''
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Full Name
                </div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.fullName || 'Not set'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Username
                </div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.username}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Email
                </div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.email}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                  Role
                </div>
                <span className="badge-info">
                  {user?.roles?.[0] || 'USER'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
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
              <Key size={20} />
              Change Password
            </h3>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary">
              <Key size={18} />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
