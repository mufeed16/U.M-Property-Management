import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MotionBackground } from '../../components/ui/MotionBackground';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={(user.role === 'admin' || user.role === 'viewer') ? '/' : '/my-room'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userData = await login(email, password);
      navigate((userData.role === 'admin' || userData.role === 'viewer') ? '/' : '/my-room');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <MotionBackground />

      <div className="relative z-10 w-full max-w-sm">
        <div
          className="rounded-2xl lg:rounded-3xl p-6 lg:p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="text-center mb-6 lg:mb-8">
            <div className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              }}>
              <span className="text-white font-bold text-xl lg:text-2xl">U</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">UM Cottage</h1>
            <p className="text-gray-400 mt-1 text-xs lg:text-sm">Property Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-glass w-full px-4 py-3 rounded-xl text-sm" placeholder="Enter your email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-glass w-full px-4 py-3 rounded-xl text-sm" placeholder="Enter your password" />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-3d w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
