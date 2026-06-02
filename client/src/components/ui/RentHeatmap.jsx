import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_COLORS = {
  paid: { bg: '#22c55e', label: 'Paid' },
  partial: { bg: '#f59e0b', label: 'Partial' },
  pending: { bg: '#fecaca', label: 'Pending' },
  none: { bg: '#f3f4f6', label: 'No Data' },
};

export function RentHeatmap({ year = new Date().getFullYear() }) {
  const { data: tenantsData } = useFetch('/tenants');
  const { data: paymentsData } = useFetch('/payments');
  const [tooltip, setTooltip] = useState(null);

  const tenants = (tenantsData?.tenants || []).filter((t) => t.room).sort((a, b) => a.room.roomNumber - b.room.roomNumber);
  const payments = paymentsData?.payments || [];

  const getStatus = (tenantId, month) => {
    const monthPayments = payments.filter(
      (p) => p.tenant === tenantId && p.month === month && p.year === year
    );
    if (monthPayments.length === 0) {
      const monthIdx = FULL_MONTHS.indexOf(month);
      const now = new Date();
      if (year > now.getFullYear() || (year === now.getFullYear() && monthIdx > now.getMonth())) return 'none';
      return 'pending';
    }
    const totalPaid = monthPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalDue = monthPayments.reduce((sum, p) => sum + p.amountDue, 0);
    if (totalPaid <= 0) return 'pending';
    if (totalPaid >= totalDue) return 'paid';
    return 'partial';
  };

  return (
    <div className="glass-card rounded-2xl p-4 lg:p-6">
      <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">Rent Collection Heatmap</h3>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="min-w-[600px]">
          {/* Month headers */}
          <div className="flex items-center gap-1 mb-2">
            <div className="w-24 flex-shrink-0" />
            {MONTHS.map((m, i) => (
              <div key={m} className="flex-1 text-center text-[10px] font-medium text-gray-400">
                {m}
              </div>
            ))}
          </div>

          {/* Rows */}
          {tenants.map((tenant) => (
            <div key={tenant._id} className="flex items-center gap-1 mb-1">
              <div className="w-24 flex-shrink-0 text-xs font-medium text-gray-600 truncate pr-2">
                R{tenant.room.roomNumber} {tenant.name.split(' ')[0]}
              </div>
              {FULL_MONTHS.map((month) => {
                const status = getStatus(tenant._id, month);
                const color = STATUS_COLORS[status];
                return (
                  <div key={month} className="flex-1 px-0.5">
                    <div
                      className="w-full aspect-square rounded-[3px] cursor-pointer transition-transform hover:scale-110 relative"
                      style={{ backgroundColor: color.bg }}
                      onMouseEnter={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          tenant: tenant.name,
                          room: tenant.room.roomNumber,
                          month: month,
                          status: color.label,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {tenants.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">No tenants with rooms assigned</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
        {Object.entries(STATUS_COLORS).filter(([k]) => k !== 'none').map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: val.bg }} />
            <span className="text-[10px] text-gray-500">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[9999] px-3 py-2 rounded-xl bg-gray-900 text-white text-xs shadow-xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          <p className="font-semibold">Room {tooltip.room} — {tooltip.tenant}</p>
          <p className="text-gray-300">{tooltip.month}: {tooltip.status}</p>
        </div>
      )}
    </div>
  );
}
