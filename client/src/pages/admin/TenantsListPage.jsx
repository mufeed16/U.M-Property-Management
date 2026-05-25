import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import api from '../../api/axios';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export function TenantsListPage() {
  const { data, loading, error, refetch } = useFetch('/tenants');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <LoadingSpinner />;

  const tenants = data?.tenants || [];

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api.delete(`/tenants/${deleteModal._id}`);
      setDeleteModal(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete tenant');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Tenants</h2>
          <p className="text-sm text-gray-500 mt-0.5">{tenants.length} total tenants</p>
        </div>
        <Link
          to="/tenants/new"
          className="btn-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        >
          <HiOutlinePlus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Tenant</span>
        </Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>}

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {tenants.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-400 text-sm">No tenants found</div>
        ) : (
          tenants.map((tenant) => (
            <div key={tenant._id} className="glass-card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{tenant.name}</h4>
                  <p className="text-xs text-gray-500">{tenant.email}</p>
                </div>
                <div className="flex gap-1">
                  <Link to={`/tenants/${tenant._id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg">
                    <HiOutlinePencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setDeleteModal(tenant)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Phone</span>
                  <p className="text-gray-700">{tenant.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Room</span>
                  <p className="text-gray-700">{tenant.room ? `Room ${tenant.room.roomNumber}` : '—'}</p>
                </div>
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
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Room</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenants.map((tenant) => (
              <tr key={tenant._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{tenant.name}</td>
                <td className="px-6 py-4 text-gray-600">{tenant.email}</td>
                <td className="px-6 py-4 text-gray-600">{tenant.phone || '—'}</td>
                <td className="px-6 py-4 text-gray-600">{tenant.room ? `Room ${tenant.room.roomNumber}` : '—'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/tenants/${tenant._id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <HiOutlinePencil className="w-5 h-5" />
                    </Link>
                    <button onClick={() => setDeleteModal(tenant)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Tenant">
        <p className="text-gray-600 mb-6 text-sm">Delete <strong>{deleteModal?.name}</strong>? This cannot be undone.</p>
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
