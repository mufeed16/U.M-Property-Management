import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineOfficeBuilding, HiOutlineUsers } from 'react-icons/hi';

const navItems = [
  { to: '/', icon: HiOutlineHome, label: 'Dashboard', end: true },
  { to: '/rooms', icon: HiOutlineOfficeBuilding, label: 'Rooms', end: false },
  { to: '/tenants', icon: HiOutlineUsers, label: 'Tenants', end: false },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[64px]"
          >
            {({ isActive }) => (
              <>
                <div
                  className="p-2 rounded-xl transition-all duration-200"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.1))',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.12)',
                  } : {}}
                >
                  <Icon className="w-5 h-5" style={{ color: isActive ? '#3b82f6' : '#9ca3af' }} />
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#3b82f6' : '#9ca3af' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
