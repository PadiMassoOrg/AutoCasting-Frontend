import { Navigate, Route, Routes } from 'react-router-dom';
import { ProfilePage } from '../features/profile-edit/pages';
import { DashboardLayout } from '../layouts';
import { ROUTES } from '../shared/lib/routes';

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
