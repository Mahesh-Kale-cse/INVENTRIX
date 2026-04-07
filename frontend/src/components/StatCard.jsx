import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon, label, value, subValue, color, trend }) {
  return (
    <div className="card" style={{
      borderLeft: `4px solid ${color}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        right: '-20px',
        bottom: '-20px',
        width: '100px',
        height: '100px',
        background: `${color}08`,
        borderRadius: '50%'
      }}></div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-sm)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {label}
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-xs)'
          }}>
            {value}
          </div>
          {subValue && (
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              {subValue}
            </div>
          )}
          {trend !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              marginTop: 'var(--space-sm)',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: trend >= 0 ? 'var(--success-500)' : 'var(--error-500)'
            }}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div style={{
          width: '60px',
          height: '60px',
          background: `${color}15`,
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
