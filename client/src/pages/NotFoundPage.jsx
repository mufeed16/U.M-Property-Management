import { Link } from 'react-router-dom';
import { MotionBackground } from '../components/ui/MotionBackground';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <MotionBackground />
      <div className="text-center relative z-10">
        <h1 className="text-7xl lg:text-8xl font-bold" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 text-sm">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="btn-3d inline-block mt-6 px-6 py-3 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
