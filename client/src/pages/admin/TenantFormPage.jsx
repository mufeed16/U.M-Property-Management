import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function TenantFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roomId: '',
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/rooms');
        setRooms(data.rooms || []);
      } catch {
        // Silently fail - room dropdown will be empty
      }
    };

    const fetchTenant = async () => {
      try {
        const { data } = await api.get(`/tenants/${id}`);
        const tenant = data.tenant;
        setForm({
          name: tenant.name,
          email: tenant.email,
          password: '',
          phone: tenant.phone || '',
          roomId: tenant.room?._id || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tenant');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    if (isEdit) fetchTenant();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      roomId: form.roomId || null,
    };

    if (!isEdit) {
      payload.password = form.password;
    }

    try {
      if (isEdit) {
        await api.put(`/tenants/${id}`, payload);
      } else {
        await api.post('/tenants', payload);
      }
      navigate('/tenants');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tenant');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Filter rooms: show vacant rooms + current tenant's room (if editing)
  const currentRoomId = form.roomId;
  const availableRooms = rooms.filter(
    (r) => r.status === 'vacant' || r._id === currentRoomId
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Tenant' : 'Add New Tenant'}
        </h2>
        <p className="text-gray-500 mt-1">
          {isEdit ? 'Update tenant details' : 'Create a new tenant account'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className={isEdit ? '' : 'sm:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Room
              </label>
              <select
                name="roomId"
                value={form.roomId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No room assigned</option>
                {availableRooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber} (Floor {room.floor}) - ${room.rentAmount}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/tenants')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Tenant' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
