import { useState, useRef, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';

export function NotificationBell() {
  const { data, loading } = useFetch('/payments');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const payments = data?.payments || [];
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const overdue = payments.filter(
    (p) => p.tenant && p.room && p.year === currentYear && p.amountPaid < p.amountDue
  );

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {overdue.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
            {overdue.length > 9 ? '9+' : overdue.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-xl z-50">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Overdue Payments</p>
            <p className="text-xs text-gray-400 mt-0.5">{overdue.length} pending this year</p>
          </div>
          <div className="p-2">
            {overdue.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-400">No overdue payments</p>
              </div>
            ) : (
              overdue.slice(0, 8).map((p) => (
                <div key={p._id} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {p.tenant?.name || 'Unknown'} — Room {p.room?.roomNumber || '?'}
                    </p>
                    <p className="text-xs text-gray-400">{p.month} {p.year}</p>
                  </div>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                    {p.amountDue - p.amountPaid} due
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
