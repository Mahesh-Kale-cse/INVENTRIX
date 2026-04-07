import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function Alert({ type = 'info', title, message, onClose }) {
    const config = {
        success: {
            icon: CheckCircle,
            bg: 'var(--success-50)',
            border: 'var(--success-500)',
            color: 'var(--success-700)'
        },
        error: {
            icon: XCircle,
            bg: 'var(--error-50)',
            border: 'var(--error-500)',
            color: 'var(--error-700)'
        },
        warning: {
            icon: AlertCircle,
            bg: 'var(--warning-50)',
            border: 'var(--warning-500)',
            color: 'var(--warning-600)'
        },
        info: {
            icon: Info,
            bg: 'var(--primary-50)',
            border: 'var(--primary-500)',
            color: 'var(--primary-700)'
        }
    };

    const { icon: Icon, bg, border, color } = config[type];

    return (
        <div style={{
            background: bg,
            border: `2px solid ${border}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            display: 'flex',
            gap: 'var(--space-md)',
            alignItems: 'flex-start'
        }}>
            <Icon size={20} style={{ color, flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
                {title && (
                    <div style={{ fontWeight: 'bold', color, marginBottom: 'var(--space-xs)' }}>
                        {title}
                    </div>
                )}
                <div style={{ color }}>{message}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color,
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        lineHeight: 1,
                        padding: 0
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
}
