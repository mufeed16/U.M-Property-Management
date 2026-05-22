import { useFetch } from '../../hooks/useFetch';
import { StatsCard } from '../../components/ui/StatsCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

export function AdminDashboard() {
  const { data, loading, error } = useFetch('/dashboard/stats');

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading dashboard: {error}
      </div>
    );
  }

  const stats = data || { totalRooms: 0, occupiedRooms: 0, vacantRooms: 0, maintenanceRooms: 0, totalTenants: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your property</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={<HiOutlineOfficeBuilding className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Occupied"
          value={stats.occupiedRooms}
          icon={<HiOutlineCheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Vacant"
          value={stats.vacantRooms}
          icon={<HiOutlineExclamationCircle className="w-6 h-6" />}
          color="yellow"
        />
        <StatsCard
          title="Total Tenants"
          value={stats.totalTenants}
          icon={<HiOutlineUsers className="w-6 h-6" />}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
        <div className="space-y-3 text-gray-600">
          <p>
            You have <span className="font-semibold text-gray-900">{stats.totalRooms}</span> rooms in your property,
            with <span className="font-semibold text-green-600">{stats.occupiedRooms}</span> currently occupied
            and <span className="font-semibold text-yellow-600">{stats.vacantRooms}</span> available for new tenants.
          </p>
          {stats.maintenanceRooms > 0 && (
            <p>
              <span className="font-semibold text-red-600">{stats.maintenanceRooms}</span> room(s) are currently under maintenance.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
