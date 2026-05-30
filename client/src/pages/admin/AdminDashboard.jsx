import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import { StatsCard } from '../../components/ui/StatsCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { RentPlanner } from '../../components/ui/RentPlanner';
import { exportAllRoomsPDF } from '../../utils/exportRentPDF';
import { HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineCurrencyDollar } from 'react-icons/hi';

function TenantPills({ tenants, selected, onChange }) {
  const sorted = [...tenants]
    .filter((t) => t.room)
    .sort((a, b) => (a.room?.roomNumber || 0) - (b.room?.roomNumber || 0));

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-1.5 px-1.5">
      <div className="flex gap-1.5 p-1.5 rounded-xl bg-gray-100/60 backdrop-blur-sm w-max">
        {sorted.map((tenant) => {
          const isSelected = selected?._id === tenant._id;
          return (
            <button
              key={tenant._id}
              onClick={() => onChange(isSelected ? null : tenant)}
              className={`rounded-lg text-xs font-semibold transition-all duration-300 ease-out whitespace-nowrap ${
                isSelected
                  ? 'bg-white text-gray-800 shadow-sm ring-1 ring-gray-200/50 px-3 py-1.5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 px-2.5 py-1.5'
              }`}
            >
              {isSelected ? `Room ${tenant.room.roomNumber} — ${tenant.name}` : tenant.room.roomNumber}
            </button>
          );
        })}
        {sorted.length === 0 && (
          <span className="px-3 py-1.5 text-xs text-gray-400">No tenants with rooms</span>
        )}
      </div>
    </div>
  );
}

function YearPills({ years, selected, onChange }) {
  return (
    <div className="flex gap-1.5 p-1 rounded-xl bg-gray-100/60 backdrop-blur-sm">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            selected === y
              ? 'bg-white text-gray-800 shadow-sm ring-1 ring-gray-200/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const { data, loading, error } = useFetch('/dashboard/stats');
  const { data: tenantsData, loading: tenantsLoading } = useFetch('/tenants');

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [exportingAll, setExportingAll] = useState(false);

  if (loading || tenantsLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 lg:p-4 rounded-xl text-sm">
        Error loading dashboard: {error}
      </div>
    );
  }

  const stats = data || { totalRooms: 0, occupiedRooms: 0, vacantRooms: 0, maintenanceRooms: 0, totalTenants: 0 };
  const tenants = tenantsData?.tenants || [];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const roomsData = [];
      const tenantsWithRooms = tenants.filter((t) => t.room);

      for (const tenant of tenantsWithRooms) {
        try {
          const { data: paymentData } = await api.get(`/payments?tenantId=${tenant._id}&year=${selectedYear}`);
          roomsData.push({
            roomNumber: tenant.room.roomNumber,
            tenantName: tenant.name,
            rentAmount: tenant.room.rentAmount || 0,
            year: selectedYear,
            payments: paymentData.payments || [],
          });
        } catch {
          roomsData.push({
            roomNumber: tenant.room.roomNumber,
            tenantName: tenant.name,
            rentAmount: tenant.room.rentAmount || 0,
            year: selectedYear,
            payments: [],
          });
        }
      }

      if (roomsData.length === 0) return;
      roomsData.sort((a, b) => a.roomNumber - b.roomNumber);
      exportAllRoomsPDF(roomsData);
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your property</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatsCard title="Total Rooms" value={stats.totalRooms} icon={<HiOutlineOfficeBuilding className="w-5 h-5 lg:w-6 lg:h-6" />} color="blue" />
        <StatsCard title="Occupied" value={stats.occupiedRooms} icon={<HiOutlineCheckCircle className="w-5 h-5 lg:w-6 lg:h-6" />} color="green" />
        <StatsCard title="Vacant" value={stats.vacantRooms} icon={<HiOutlineExclamationCircle className="w-5 h-5 lg:w-6 lg:h-6" />} color="yellow" />
        <StatsCard title="Tenants" value={stats.totalTenants} icon={<HiOutlineUsers className="w-5 h-5 lg:w-6 lg:h-6" />} color="purple" />
      </div>

      <div className="glass-card rounded-2xl p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3">Quick Summary</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">{stats.totalRooms}</span> rooms total,
          <span className="font-semibold text-green-600"> {stats.occupiedRooms}</span> occupied,
          <span className="font-semibold text-yellow-600"> {stats.vacantRooms}</span> available.
          {stats.maintenanceRooms > 0 && (
            <span className="font-semibold text-red-600"> {stats.maintenanceRooms} under maintenance.</span>
          )}
        </p>
      </div>

      {/* Rent Planner */}
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 lg:p-2 rounded-xl bg-blue-50">
              <HiOutlineCurrencyDollar className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-800">Rent Planner</h3>
          </div>
          <button
            onClick={handleExportAll}
            disabled={exportingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-all disabled:opacity-50"
          >
            {exportingAll ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Export All
          </button>
        </div>

        <div className="glass-card rounded-2xl p-3 lg:p-4 space-y-2.5">
          <TenantPills tenants={tenants} selected={selectedTenant} onChange={setSelectedTenant} />
          <YearPills years={years} selected={selectedYear} onChange={setSelectedYear} />
        </div>

        {selectedTenant ? (
          selectedTenant.room ? (
            <RentPlanner
              tenantId={selectedTenant._id}
              year={selectedYear}
              tenantName={selectedTenant.name}
              roomNumber={selectedTenant.room?.roomNumber}
              rentAmount={selectedTenant.room?.rentAmount}
            />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 lg:p-4 rounded-xl text-sm">
              {selectedTenant.name} has no room assigned.
            </div>
          )
        ) : (
          <div className="glass-card rounded-2xl p-6 lg:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <HiOutlineCurrencyDollar className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">Select a tenant to view rent planner</p>
            <p className="text-xs text-gray-400 mt-1">Use the search above to find a tenant</p>
          </div>
        )}
      </div>
    </div>
  );
}
