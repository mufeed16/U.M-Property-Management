import { useAuth } from '../../hooks/useAuth';
import { HiOutlineLogout } from 'react-icons/hi';

export function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-black/5 transition-all"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-lg lg:text-xl font-bold" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UM Cottage</h1>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl transition-all text-gray-400 hover:text-red-500 hover:bg-red-50"
              title="Logout"
            >
              <HiOutlineLogout className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
