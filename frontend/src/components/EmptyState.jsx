import React from 'react';

export default function EmptyState({
    icon = '📭',
    title = 'No data found',
    description,
    action
}) {
    return (
        <div className="card" style={{
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-lg)'
        }}>
            <div style={{ fontSize: '4rem' }}>{icon}</div>
            <div>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-primary)'
                }}>
                    {title}
                </h3>
                {description && (
                    <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
