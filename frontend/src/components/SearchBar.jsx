import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search...',
    onSearch,
    className = ''
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(value);
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
            <Search
                size={20}
                style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)'
                }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`form-input ${className}`}
                style={{
                    paddingLeft: '3rem',
                    background: 'var(--bg-tertiary)'
                }}
            />
        </form>
    );
}
