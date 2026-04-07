import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        background: 'var(--bg-secondary)',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header with Theme Toggle */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div style={{ padding: '2rem' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
