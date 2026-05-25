export function StatsCard({ title, value, icon, color = 'blue' }) {
  const colorStyles = {
    blue: {
      bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.06))',
      icon: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      glow: '0 4px 12px rgba(59, 130, 246, 0.25)',
    },
    green: {
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(16, 185, 129, 0.06))',
      icon: 'linear-gradient(135deg, #22c55e, #10b981)',
      glow: '0 4px 12px rgba(34, 197, 94, 0.25)',
    },
    yellow: {
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(234, 179, 8, 0.06))',
      icon: 'linear-gradient(135deg, #f59e0b, #eab308)',
      glow: '0 4px 12px rgba(245, 158, 11, 0.25)',
    },
    red: {
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.06))',
      icon: 'linear-gradient(135deg, #ef4444, #dc2626)',
      glow: '0 4px 12px rgba(239, 68, 68, 0.25)',
    },
    purple: {
      bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(139, 92, 246, 0.06))',
      icon: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
      glow: '0 4px 12px rgba(168, 85, 247, 0.25)',
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="perspective-container">
      <div
        className="card-3d rounded-xl lg:rounded-2xl p-4 lg:p-6"
        style={{
          background: style.bg,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="flex items-center gap-3 lg:gap-4">
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{
              background: style.icon,
              boxShadow: style.glow,
            }}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="text-xl lg:text-3xl font-bold text-gray-800 mt-0.5">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
