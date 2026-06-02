import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { TenantLayout } from './components/layout/TenantLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RoomsListPage } from './pages/admin/RoomsListPage';
import { RoomFormPage } from './pages/admin/RoomFormPage';
import { TenantsListPage } from './pages/admin/TenantsListPage';
import { TenantFormPage } from './pages/admin/TenantFormPage';
import { TenantDashboard } from './pages/tenant/TenantDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'viewer']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/rooms" element={<RoomsListPage />} />
              <Route path="/rooms/new" element={<RoomFormPage />} />
              <Route path="/rooms/:id/edit" element={<RoomFormPage />} />
              <Route path="/tenants" element={<TenantsListPage />} />
              <Route path="/tenants/new" element={<TenantFormPage />} />
              <Route path="/tenants/:id/edit" element={<TenantFormPage />} />
            </Route>
          </Route>

          {/* Tenant routes */}
          <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
            <Route element={<TenantLayout />}>
              <Route path="/my-room" element={<TenantDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
