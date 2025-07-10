import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/pages';
import { ProfilePage } from '../features/profile/pages';
import { ROUTES } from '../shared/lib/routes';

export default function ProtectedRoutesLayout() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
    </Routes>
  );
}
