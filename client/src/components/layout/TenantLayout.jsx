import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MotionBackground } from '../ui/MotionBackground';

export function TenantLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <MotionBackground />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 pb-8">
          <div className="page-enter max-w-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
