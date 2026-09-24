import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeModeProvider } from './theme/ThemeModeContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import RequestsFeed from './pages/RequestsFeed';
import MyRequests from './pages/MyRequests';
import CreateRequest from './pages/CreateRequest';
import RequestDetail from './pages/RequestDetail';
import Appearance from './pages/Appearance';
import MyDues from './pages/MyDues';
import MyContributions from './pages/MyContributions';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPendingRequests from './pages/admin/PendingRequests';
import AdminAllRequests from './pages/admin/AllRequests';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminDuesSchedules from './pages/admin/DuesSchedules';
import AdminDuesScheduleDetail from './pages/admin/DuesScheduleDetail';
import AdminTransactions from './pages/admin/Transactions';

export default function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/appearance" element={<Appearance />} />

              <Route element={<Layout />}>
                <Route path="/" element={<RequestsFeed />} />
                <Route path="/requests/mine" element={<MyRequests />} />
                <Route path="/requests/new" element={<CreateRequest />} />
                <Route path="/requests/:id" element={<RequestDetail />} />
                <Route path="/dues" element={<MyDues />} />
                <Route path="/contributions" element={<MyContributions />} />

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="requests/pending" element={<AdminPendingRequests />} />
                    <Route path="requests" element={<AdminAllRequests />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="dues-schedules" element={<AdminDuesSchedules />} />
                    <Route path="dues-schedules/:id" element={<AdminDuesScheduleDetail />} />
                    <Route path="transactions" element={<AdminTransactions />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
