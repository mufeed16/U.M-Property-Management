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
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading room information: {error}
      </div>
    );
  }

  const room = data?.room;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HiOutlineOfficeBuilding className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Room Information</h3>
          </div>

          {room ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Room Number</span>
                <span className="font-medium text-gray-900">{room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Floor</span>
                <span className="font-medium text-gray-900">{room.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={room.status === 'occupied' ? 'success' : room.status === 'vacant' ? 'warning' : 'danger'}>
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Rent</span>
                <span className="font-medium text-gray-900">${room.rentAmount}</span>
              </div>
              {room.amenities?.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Amenities</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.amenities.map((amenity, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {room.description && (
                <div>
                  <span className="text-gray-500 text-sm">Description</span>
                  <p className="text-gray-700 mt-1">{room.description}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No room assigned yet.</p>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <HiOutlineUser className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <HiOutlineUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineMail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}
            {user?.createdAt && (
              <div className="flex items-center gap-3">
                <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
