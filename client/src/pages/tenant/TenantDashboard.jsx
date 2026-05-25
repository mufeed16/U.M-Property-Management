import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi';

export function TenantDashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(user?.room ? `/rooms/${user.room._id || user.room}` : null);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
        Error loading room: {error}
      </div>
    );
  }

  const room = data?.room;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">My Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
      </div>

      {/* Room Info Card */}
      <div className="glass-card rounded-2xl p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-50">
            <HiOutlineOfficeBuilding className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Room Information</h3>
        </div>

        {room ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Room Number</span>
              <span className="font-medium text-gray-800">{room.roomNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Floor</span>
              <span className="font-medium text-gray-800">{room.floor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <Badge variant={room.status === 'occupied' ? 'success' : room.status === 'vacant' ? 'warning' : 'danger'}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monthly Rent</span>
              <span className="font-medium text-gray-800">₹{room.rentAmount}</span>
            </div>
            {room.amenities?.length > 0 && (
              <div>
                <span className="text-gray-500 text-xs">Amenities</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {room.amenities.map((amenity, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No room assigned yet.</p>
        )}
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-50">
            <HiOutlineUser className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800">My Profile</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <HiOutlineUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
            </div>
          </div>
          {user?.phone && (
            <div className="flex items-center gap-3">
              <HiOutlinePhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-800">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
