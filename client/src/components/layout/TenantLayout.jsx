import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function TenantLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
