import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/pages';
import { ProfilePage } from '../features/profile/pages';

export default function ProtectedRoutesLayout() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />
    </Routes>
  );
}
