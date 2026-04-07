export const formatCurrency = (num) => \`$\${num?.toLocaleString() || 0}\`;
export const formatDate = (date) => new Date(date).toLocaleDateString();
