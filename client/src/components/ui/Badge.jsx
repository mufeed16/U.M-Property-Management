const variants = {
  success: {
    background: 'rgba(34, 197, 94, 0.12)',
    color: '#16a34a',
    border: '1px solid rgba(34, 197, 94, 0.2)',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: '#d97706',
    border: '1px solid rgba(245, 158, 11, 0.2)',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#dc2626',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  info: {
    background: 'rgba(59, 130, 246, 0.12)',
    color: '#2563eb',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
};

export function Badge({ variant = 'info', children }) {
  const style = variants[variant] || variants.info;

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={style}
    >
      {children}
    </span>
  );
}
