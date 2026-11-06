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
import MemberDashboard from './pages/MemberDashboard';
import MemberRequests from './pages/MemberRequests';
import MemberContributions from './pages/MemberContributions';
import ManageRequests from './pages/admin/ManageRequests';
import MemberPayments from './pages/MemberPayments';
import MemberDependants from './pages/MemberDependants';
import RequestDetail from './pages/RequestDetail';
import Appearance from './pages/Appearance';
import MyDues from './pages/MyDues';
import AdminDashboard from './pages/admin/Dashboard';
import ManageMembers from './pages/admin/ManageMembers';
import ManageMeetings from './pages/admin/ManageMeetings';
import ManageContributions from './pages/admin/ManageContributions';

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
                <Route path="/" element={<MemberDashboard />} />
                <Route path="/dashboard" element={<MemberDashboard />} />
                <Route path="/requests/mine" element={<MemberRequests />} />
                <Route path="/requests/new" element={<CreateRequest />} />
                <Route path="/requests/:id" element={<RequestDetail />} />
                <Route path="/dues" element={<MyDues />} />
                <Route path="/contributions" element={<MemberContributions />} />
                <Route path="/payments" element={<MemberPayments />} />
                <Route path="/dependants" element={<MemberDependants />} />

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="members" element={<ManageMembers />} />
                    <Route path="requests" element={<ManageRequests />} />
                    <Route path="meetings" element={<ManageMeetings />} />
                    <Route path="contributions" element={<ManageContributions />} />
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
