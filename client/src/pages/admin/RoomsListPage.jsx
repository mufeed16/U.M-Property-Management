import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { AuthContext } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import api from '../../api/axios';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const statusConfig = {
  occupied: { variant: 'success', label: 'Occupied' },
  vacant: { variant: 'warning', label: 'Vacant' },
  maintenance: { variant: 'danger', label: 'Maintenance' },
};

export function RoomsListPage() {
  const { user } = useContext(AuthContext);
  const isViewer = user?.role === 'viewer';
  const { data, loading, error, refetch } = useFetch('/rooms');
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <LoadingSpinner />;

  const rooms = data?.rooms || [];
  const filteredRooms = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api.delete(`/rooms/${deleteModal._id}`);
      setDeleteModal(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Rooms</h2>
          <p className="text-sm text-gray-500 mt-0.5">{rooms.length} total rooms</p>
        </div>
        {!isViewer && (
          <Link
            to="/rooms/new"
            className="btn-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Room</span>
          </Link>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {['all', 'occupied', 'vacant', 'maintenance'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={filter === status ? {
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: '#2563eb',
            } : {
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: '#6b7280',
            }}
          >
            {status === 'all' ? 'All' : statusConfig[status].label}
            <span className="ml-1 opacity-60">
              ({status === 'all' ? rooms.length : rooms.filter(r => r.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: Card layout / Desktop: Table */}
      <div className="space-y-3 lg:space-y-0">
        {/* Mobile cards */}
        <div className="lg:hidden space-y-3">
          {filteredRooms.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-gray-400 text-sm">No rooms found</div>
          ) : (
            filteredRooms.map((room) => (
              <div key={room._id} className="glass-card rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Room {room.roomNumber}</h4>
                    <p className="text-xs text-gray-500">{room.floor}</p>
                  </div>
                  <Badge variant={statusConfig[room.status].variant}>{statusConfig[room.status].label}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Tenant</span>
                      <p className="text-gray-700 font-medium">{room.tenant?.name || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rent</span>
                      <p className="text-gray-700 font-medium">₹{room.rentAmount}</p>
                    </div>
                  </div>
                  {!isViewer && (
                    <div className="flex gap-1">
                      <Link to={`/rooms/${room._id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg">
                        <HiOutlinePencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteModal(room)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Room #</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rent</th>
                {!isViewer && <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRooms.map((room) => (
                <tr key={room._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{room.roomNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{room.floor}</td>
                  <td className="px-6 py-4"><Badge variant={statusConfig[room.status].variant}>{statusConfig[room.status].label}</Badge></td>
                  <td className="px-6 py-4 text-gray-600">{room.tenant?.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-600">₹{room.rentAmount}</td>
                  {!isViewer && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/rooms/${room._id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <HiOutlinePencil className="w-5 h-5" />
                        </Link>
                        <button onClick={() => setDeleteModal(room)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Room">
        <p className="text-gray-600 mb-6 text-sm">Delete Room <strong>{deleteModal?.roomNumber}</strong>? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 text-sm">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-3d px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 text-sm">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
