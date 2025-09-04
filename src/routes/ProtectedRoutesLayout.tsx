import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfilePage } from '../features/profile/pages';
import { ROUTES } from '../shared/lib/routes';
import { DashboardLayout } from '../layouts';

export default function ProtectedRoutesLayout() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
        <Route index element={<Navigate to={ROUTES.PROFILE} replace />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
