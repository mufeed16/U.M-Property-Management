import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { LoadingSpinner } from './LoadingSpinner';
import { exportSingleRoomPDF } from '../../utils/exportRentPDF';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTHS = {
  January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
  May: 'May', June: 'Jun', July: 'Jul', August: 'Aug',
  September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec',
};

const MONTH_ICONS = ['❄️', '🌸', '🌿', '☀️', '🌺', '🍉', '🌻', '🏖️', '🍂', '🎃', '🍁', '🎄'];

function ProgressRing({ percent, size = 40, strokeWidth = 3.5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 100 ? '#22c55e' : percent > 0 ? '#f59e0b' : '#e5e7eb';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.23,1,0.32,1)' }}
      />
    </svg>
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    partial: 'bg-amber-50 text-amber-700 border-amber-200/60',
    pending: 'bg-gray-100 text-gray-500 border-gray-200/60',
  };
  const dots = { paid: 'bg-emerald-500', partial: 'bg-amber-500', pending: 'bg-gray-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

export function RentPlanner({ tenantId, year, tenantName, roomNumber, rentAmount: rentAmountProp }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amountPaid: '', datePaid: '' });
  const [addingMonth, setAddingMonth] = useState(null);
  const [addForm, setAddForm] = useState({ amountPaid: '', datePaid: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  const amountDue = rentAmountProp || (payments.length > 0 ? payments[0].amountDue : 0);

  const fetchPayments = useCallback(async () => {
    if (!tenantId || !year) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/payments?tenantId=${tenantId}&year=${year}`);
      setPayments(data.payments);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rent data');
    } finally {
      setLoading(false);
    }
  }, [tenantId, year]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const paymentsByMonth = MONTHS.reduce((acc, month) => {
    acc[month] = payments.filter((p) => p.month === month);
    return acc;
  }, {});

  const startEdit = (payment) => {
    setEditingId(payment._id);
    setAddingMonth(null);
    setEditForm({
      amountPaid: payment.amountPaid || '',
      datePaid: payment.datePaid ? new Date(payment.datePaid).toISOString().split('T')[0] : '',
    });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({ amountPaid: '', datePaid: '' }); };

  const savePayment = async (paymentId) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/payments/${paymentId}`, { amountPaid: editForm.amountPaid, datePaid: editForm.datePaid || null });
      if (data.payments) setPayments(data.payments);
      else setPayments((prev) => prev.map((p) => (p._id === paymentId ? data.payment : p)));
      setEditingId(null);
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    const paymentId = deleteConfirm;
    setDeleteConfirm(null);
    try { await api.delete(`/payments/${paymentId}`); setPayments((prev) => prev.filter((p) => p._id !== paymentId)); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
  };

  const deletePayment = (paymentId) => { setDeleteConfirm(paymentId); };

  const startAdd = (month) => { setAddingMonth(month); setEditingId(null); setAddForm({ amountPaid: '', datePaid: '' }); };
  const cancelAdd = () => { setAddingMonth(null); setAddForm({ amountPaid: '', datePaid: '' }); };

  const saveNewEntry = async (month) => {
    setSaving(true);
    try {
      const { data } = await api.post('/payments', { tenantId, year, month, amountPaid: addForm.amountPaid, datePaid: addForm.datePaid || null });
      if (data.payments) setPayments(data.payments);
      else setPayments((prev) => [...prev, data.payment]);
      setAddingMonth(null); setAddForm({ amountPaid: '', datePaid: '' });
    } catch (err) { alert(err.response?.data?.message || 'Failed to add'); }
    finally { setSaving(false); }
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalDue = amountDue * 12;
  const totalRemaining = totalDue - totalPaid;
  const paidPercent = totalDue > 0 ? Math.min(100, Math.round((totalPaid / totalDue) * 100)) : 0;
  const paidMonths = MONTHS.filter((m) => {
    const t = paymentsByMonth[m].reduce((s, p) => s + p.amountPaid, 0);
    return t >= amountDue && amountDue > 0;
  }).length;

  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    try {
      exportSingleRoomPDF({
        roomNumber: roomNumber || 'N/A',
        tenantName: tenantName || 'N/A',
        rentAmount: amountDue,
        year,
        payments,
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>;

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Annual Overview */}
        <div className="glass-card rounded-2xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <ProgressRing percent={paidPercent} size={56} strokeWidth={4} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{paidPercent}%</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Annual Progress</p>
              <p className="text-lg font-bold text-gray-800">{paidMonths}/12 months paid</p>
              <p className="text-xs text-gray-400">₹{totalPaid.toLocaleString()} of ₹{totalDue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className={`glass-card rounded-2xl p-4 col-span-2 sm:col-span-1 ${totalRemaining <= 0 ? 'ring-1 ring-emerald-200/50' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Remaining</p>
              <p className={`text-2xl font-bold ${totalRemaining > 0 ? 'text-gray-800' : 'text-emerald-600'}`}>
                {totalRemaining > 0 ? `₹${totalRemaining.toLocaleString()}` : 'All Clear'}
              </p>
            </div>
            {totalRemaining <= 0 && (
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Year Progress Bar + Export ── */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{year} Overview</p>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-400">₹{amountDue.toLocaleString()}/mo</p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-all disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {MONTHS.map((month, i) => {
            const entries = paymentsByMonth[month];
            const totalPaidForMonth = entries.reduce((sum, p) => sum + p.amountPaid, 0);
            let fill, borderColor;
            if (entries.length === 0 || totalPaidForMonth <= 0) {
              fill = 'bg-gray-100'; borderColor = 'border-gray-200/50';
            } else if (totalPaidForMonth >= amountDue) {
              fill = 'bg-emerald-400'; borderColor = 'border-emerald-300';
            } else {
              fill = 'bg-amber-400'; borderColor = 'border-amber-300';
            }
            return (
              <div key={month} className="flex-1 group relative">
                <div className={`h-3 rounded-full ${fill} border ${borderColor} transition-all duration-300 group-hover:scale-y-150 group-hover:brightness-110`} />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {SHORT_MONTHS[month]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-gray-400">Paid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[10px] text-gray-400">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-200" />
            <span className="text-[10px] text-gray-400">Pending</span>
          </div>
        </div>
      </div>

      {/* ── Mobile: Month Cards ── */}
      <div className="lg:hidden space-y-2">
        {MONTHS.map((month, idx) => {
          const entries = paymentsByMonth[month];
          const totalPaidForMonth = entries.reduce((sum, p) => sum + p.amountPaid, 0);
          const remainingForMonth = amountDue - totalPaidForMonth;
          const percent = amountDue > 0 ? Math.min(100, Math.round((totalPaidForMonth / amountDue) * 100)) : 0;
          let status;
          if (entries.length === 0 || totalPaidForMonth <= 0) status = 'pending';
          else if (totalPaidForMonth >= amountDue) status = 'paid';
          else status = 'partial';

          const isExpanded = expandedMonth === month;
          const isCurrent = new Date().getMonth() === idx && new Date().getFullYear() === year;

          return (
            <div
              key={month}
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isCurrent ? 'ring-2 ring-blue-400/40' : ''}`}
            >
              {/* Month Header — always visible */}
              <button
                onClick={() => setExpandedMonth(isExpanded ? null : month)}
                className="w-full flex items-center gap-3 p-3.5 text-left active:bg-blue-50/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-base flex-shrink-0">
                  {MONTH_ICONS[idx]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{month}</span>
                    {isCurrent && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">NOW</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${status === 'paid' ? 'bg-emerald-400' : status === 'partial' ? 'bg-amber-400' : 'bg-gray-200'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 tabular-nums flex-shrink-0">{percent}%</span>
                  </div>
                </div>
                <StatusBadge status={status} />
                <svg className={`w-4 h-4 text-gray-300 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 border-t border-gray-100/80">
                  {/* Amount summary row */}
                  <div className="flex items-center justify-between py-2.5">
                    <div className="text-xs text-gray-400">
                      Paid: <span className="font-semibold text-gray-700">₹{totalPaidForMonth.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {remainingForMonth > 0 ? (
                        <>Due: <span className="font-semibold text-red-500">₹{remainingForMonth.toLocaleString()}</span></>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Fully Paid</span>
                      )}
                    </div>
                  </div>

                  {/* Payment entries */}
                  {entries.map((payment) => {
                    const isEditing = editingId === payment._id;
                    if (isEditing) {
                      return (
                        <div key={payment._id} className="bg-blue-50/40 rounded-xl p-3 mb-2 space-y-2">
                          <input
                            type="date" value={editForm.datePaid}
                            onChange={(e) => setEditForm((f) => ({ ...f, datePaid: e.target.value }))}
                            className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                          />
                          <input
                            type="number" value={editForm.amountPaid}
                            onChange={(e) => setEditForm((f) => ({ ...f, amountPaid: e.target.value }))}
                            min="0" placeholder="Amount" className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => savePayment(payment._id)} disabled={saving} className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-blue-500 active:bg-blue-600 disabled:opacity-50 transition-colors">
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={cancelEdit} className="px-4 py-2 rounded-xl text-sm text-gray-500 bg-gray-100 active:bg-gray-200 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={payment._id} className="flex items-center justify-between py-2 group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">₹{payment.amountPaid.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">
                              {payment.datePaid ? new Date(payment.datePaid).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No date'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(payment)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => deletePayment(payment._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add payment */}
                  {addingMonth === month ? (
                    <div className="bg-blue-50/30 rounded-xl p-3 mt-1 space-y-2">
                      <input
                        type="date" value={addForm.datePaid}
                        onChange={(e) => setAddForm((f) => ({ ...f, datePaid: e.target.value }))}
                        className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                      />
                      <input
                        type="number" value={addForm.amountPaid}
                        onChange={(e) => setAddForm((f) => ({ ...f, amountPaid: e.target.value }))}
                        min="0" placeholder="Amount" className="input-glass w-full px-3 py-2 rounded-xl text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveNewEntry(month)} disabled={saving} className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-emerald-500 active:bg-emerald-600 disabled:opacity-50 transition-colors">
                          {saving ? 'Saving...' : 'Add Payment'}
                        </button>
                        <button onClick={cancelAdd} className="px-4 py-2 rounded-xl text-sm text-gray-500 bg-gray-100 active:bg-gray-200 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startAdd(month)}
                      className="w-full mt-1 py-2 rounded-xl text-sm font-medium text-blue-600 bg-blue-50/50 active:bg-blue-100 border border-dashed border-blue-200 transition-colors"
                    >
                      + Add Payment
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Desktop: Enhanced Table ── */}
      <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Month</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date Paid</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Progress</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((month, idx) => {
                const entries = paymentsByMonth[month];
                const totalPaidForMonth = entries.reduce((sum, p) => sum + p.amountPaid, 0);
                const remainingForMonth = amountDue - totalPaidForMonth;
                const percent = amountDue > 0 ? Math.min(100, Math.round((totalPaidForMonth / amountDue) * 100)) : 0;
                let status;
                if (entries.length === 0 || totalPaidForMonth <= 0) status = 'pending';
                else if (totalPaidForMonth >= amountDue) status = 'paid';
                else status = 'partial';

                const isCurrent = new Date().getMonth() === idx && new Date().getFullYear() === year;
                const isLastMonth = idx === MONTHS.length - 1;

                const rows = [];

                /* Empty month row */
                if (entries.length === 0) {
                  rows.push(
                    <tr key={`${month}-empty`} className={`hover:bg-blue-50/20 transition-colors ${isCurrent ? 'bg-blue-50/20' : ''} ${!isLastMonth ? 'border-b border-gray-50' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{MONTH_ICONS[idx]}</span>
                          <span className="text-sm font-medium text-gray-800">{month}</span>
                          {isCurrent && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold">NOW</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">—</td>
                      <td className="px-5 py-3 text-sm text-gray-400">₹0</td>
                      <td className="px-5 py-3">
                        <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full w-0 rounded-full bg-gray-200" />
                        </div>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={status} /></td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => startAdd(month)} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">+ Add</button>
                      </td>
                    </tr>
                  );
                }

                /* Payment entry rows */
                entries.forEach((payment, pIdx) => {
                  const isEditing = editingId === payment._id;
                  const isFirst = pIdx === 0;
                  const isLastEntry = pIdx === entries.length - 1;
                  const showBorder = !isLastMonth || !isLastEntry || addingMonth === month;
                  rows.push(
                    <tr key={payment._id} className={`transition-colors ${isEditing ? 'bg-blue-50/30' : 'hover:bg-blue-50/20'} ${isCurrent ? 'bg-blue-50/20' : ''} ${showBorder ? 'border-b border-gray-50' : ''}`}>
                      <td className="px-5 py-3">
                        {isFirst ? (
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{MONTH_ICONS[idx]}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">{month}</span>
                                {isCurrent && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold">NOW</span>}
                              </div>
                              {entries.length > 1 && <span className="text-[10px] text-gray-400">{entries.length} payments</span>}
                            </div>
                          </div>
                        ) : (
                          <span className="pl-8 text-gray-300 text-xs">↳</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {isEditing ? (
                          <input type="date" value={editForm.datePaid} onChange={(e) => setEditForm((f) => ({ ...f, datePaid: e.target.value }))} className="input-glass px-2 py-1.5 rounded-lg text-sm w-36" />
                        ) : (
                          payment.datePaid ? new Date(payment.datePaid).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {isEditing ? (
                          <input type="number" value={editForm.amountPaid} onChange={(e) => setEditForm((f) => ({ ...f, amountPaid: e.target.value }))} min="0" className="input-glass w-24 px-2 py-1.5 rounded-lg text-sm" />
                        ) : (
                          <span className="font-medium text-gray-800">₹{payment.amountPaid.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isFirst ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${status === 'paid' ? 'bg-emerald-400' : status === 'partial' ? 'bg-amber-400' : 'bg-gray-200'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400 tabular-nums">{percent}%</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-5 py-3">
                        {isFirst ? <StatusBadge status={status} /> : null}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {isEditing ? (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => savePayment(payment._id)} disabled={saving} className="px-3 py-1 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-colors">
                              {saving ? '...' : 'Save'}
                            </button>
                            <button onClick={cancelEdit} className="px-3 py-1 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => startEdit(payment)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors" title="Edit">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => deletePayment(payment._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            {isFirst && <button onClick={() => startAdd(month)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors" title="Add payment">+</button>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                });

                /* Add row */
                if (addingMonth === month) {
                  rows.push(
                    <tr key={`${month}-add`} className="bg-emerald-50/20 border-b border-gray-50">
                      <td className="px-5 py-3"><span className="pl-8 text-gray-300 text-xs">↳ new</span></td>
                      <td className="px-5 py-3"><input type="date" value={addForm.datePaid} onChange={(e) => setAddForm((f) => ({ ...f, datePaid: e.target.value }))} className="input-glass px-2 py-1.5 rounded-lg text-sm w-36" /></td>
                      <td className="px-5 py-3"><input type="number" value={addForm.amountPaid} onChange={(e) => setAddForm((f) => ({ ...f, amountPaid: e.target.value }))} min="0" placeholder="₹" className="input-glass w-24 px-2 py-1.5 rounded-lg text-sm" /></td>
                      <td className="px-5 py-3" />
                      <td className="px-5 py-3" />
                      <td className="px-5 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => saveNewEntry(month)} disabled={saving} className="px-3 py-1 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
                            {saving ? '...' : 'Save'}
                          </button>
                          <button onClick={cancelAdd} className="px-3 py-1 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return rows;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div
            className="relative rounded-2xl w-full max-w-xs p-6 text-center"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Delete Payment?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 active:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 active:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
