import React from 'react';

export default function DataTable({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data available',
    onRowClick
}) {
    if (loading) {
        return (
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, idx) => (
                            <tr key={idx}>
                                {columns.map((_, colIdx) => (
                                    <td key={colIdx}>
                                        <div className="skeleton" style={{ height: '20px', width: '80%' }}></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📭</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                style={{
                                    textAlign: col.align || 'left',
                                    width: col.width
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr
                            key={row.id || rowIdx}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                        >
                            {columns.map((col, colIdx) => (
                                <td
                                    key={colIdx}
                                    style={{ textAlign: col.align || 'left' }}
                                >
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
