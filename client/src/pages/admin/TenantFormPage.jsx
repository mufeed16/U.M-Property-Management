import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function TenantFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', roomId: '' });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try { const { data } = await api.get('/rooms'); setRooms(data.rooms || []); } catch {}
    };
    const fetchTenant = async () => {
      try {
        const { data } = await api.get(`/tenants/${id}`);
        const tenant = data.tenant;
        setForm({ name: tenant.name, email: tenant.email, password: '', phone: tenant.phone || '', roomId: tenant.room?._id || '' });
      } catch (err) { setError(err.response?.data?.message || 'Failed to load tenant'); }
      finally { setLoading(false); }
    };
    fetchRooms();
    if (isEdit) fetchTenant();
  }, [id, isEdit]);

  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    const payload = { name: form.name, email: form.email, phone: form.phone, roomId: form.roomId || null };
    if (!isEdit) payload.password = form.password;
    try {
      if (isEdit) { await api.put(`/tenants/${id}`, payload); } else { await api.post('/tenants', payload); }
      navigate('/tenants');
    } catch (err) { setError(err.response?.data?.message || 'Failed to save tenant'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;

  const currentRoomId = form.roomId;
  const availableRooms = rooms.filter((r) => r.status === 'vacant' || r._id === currentRoomId);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{isEdit ? 'Edit Tenant' : 'Add New Tenant'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? 'Update tenant details' : 'Create a new tenant account'}</p>
      </div>

      <div className="glass-card rounded-2xl p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-sm">{error}</div>}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
            </div>
            {!isEdit && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password *</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength="6" className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Assign Room</label>
              <select name="roomId" value={form.roomId} onChange={handleChange} className="select-glass w-full px-3 py-2.5 rounded-xl text-sm">
                <option value="">No room assigned</option>
                {availableRooms.map((room) => (
                  <option key={room._id} value={room._id}>Room {room.roomNumber} ({room.floor}) - ₹{room.rentAmount}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/tenants')} className="flex-1 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 text-sm font-medium transition-all border border-gray-200">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-3d flex-1 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
