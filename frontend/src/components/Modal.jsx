import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const sizes = {
        sm: '400px',
        md: '600px',
        lg: '800px',
        xl: '1000px'
    };

    return createPortal(
        <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
            <div
                className="card animate-fadeIn"
                style={{
                    maxWidth: sizes[size],
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    background: 'var(--bg-primary)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{title}</h2>
                    <button
                        onClick={onClose}
                        className="btn-icon btn-ghost"
                        style={{ fontSize: '1.5rem', lineHeight: 1 }}
                    >
                        ×
                    </button>
                </div>
                <div>{children}</div>
                {footer && (
                    <div style={{
                        marginTop: 'var(--space-xl)',
                        paddingTop: 'var(--space-lg)',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: 'var(--space-md)',
                        justifyContent: 'flex-end'
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
