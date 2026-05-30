import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineOfficeBuilding, HiOutlineUsers } from 'react-icons/hi';

const navItems = [
  { to: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { to: '/rooms', icon: HiOutlineOfficeBuilding, label: 'Rooms' },
  { to: '/tenants', icon: HiOutlineUsers, label: 'Tenants' },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="p-6" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}>
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">UM Cottage</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Property Manager</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(99, 102, 241, 0.08))',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.15)',
              } : {
                border: '1px solid transparent',
              }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #3b82f6, #6366f1)' }}
                    />
                  )}
                  <div className={`p-2 rounded-lg transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 hidden lg:block">
          <div className="rounded-xl p-4"
            style={{
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.08)',
            }}>
            <p className="text-xs text-gray-400">Phase 1</p>
            <p className="text-sm text-gray-600 font-medium">Property Management</p>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full w-3/4 rounded-full"
                style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
