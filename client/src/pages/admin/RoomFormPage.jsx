import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function RoomFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    roomNumber: '', floor: 'Ground Floor', capacity: 1, rentAmount: 0, status: 'vacant', amenities: '', description: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        const room = data.room;
        setForm({ roomNumber: room.roomNumber, floor: room.floor, capacity: room.capacity, rentAmount: room.rentAmount, status: room.status, amenities: room.amenities.join(', '), description: room.description || '' });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load room');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = { ...form, roomNumber: Number(form.roomNumber), floor: form.floor, capacity: Number(form.capacity), rentAmount: Number(form.rentAmount), amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean) };
    try {
      if (isEdit) { await api.put(`/rooms/${id}`, payload); } else { await api.post('/rooms', payload); }
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{isEdit ? 'Edit Room' : 'Add New Room'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? 'Update room details' : 'Create a new room'}</p>
      </div>

      <div className="glass-card rounded-2xl p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Room Number *</label>
              <input type="number" name="roomNumber" value={form.roomNumber} onChange={handleChange} required min="1" className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Floor</label>
              <select name="floor" value={form.floor} onChange={handleChange} className="select-glass w-full px-3 py-2.5 rounded-xl text-sm">
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
                <option value="Second Floor">Second Floor</option>
                <option value="Third Floor">Third Floor</option>
                <option value="Fourth Floor">Fourth Floor</option>
                <option value="Fifth Floor">Fifth Floor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Capacity</label>
              <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min="1" className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Rent (₹)</label>
              <input type="number" name="rentAmount" value={form.rentAmount} onChange={handleChange} min="0" className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="select-glass w-full px-3 py-2.5 rounded-xl text-sm">
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Amenities (comma-separated)</label>
            <input type="text" name="amenities" value={form.amenities} onChange={handleChange} placeholder="WiFi, AC, Private Bathroom" className="input-glass w-full px-3 py-2.5 rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="2" className="input-glass w-full px-3 py-2.5 rounded-xl text-sm resize-none"></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/rooms')} className="flex-1 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 text-sm font-medium transition-all border border-gray-200">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-3d flex-1 py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
