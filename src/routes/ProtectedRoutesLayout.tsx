import { Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from '../features/profile-account/pages/AccountPage';
import { ProfilePage } from '../features/profile-edit/pages';
import { ScrollContentLayout } from '../layouts';
import { ROUTES } from '../shared/lib/routes';

export default function ProtectedRoutesLayout() {
  return (
    <Routes>
      <Route element={<ScrollContentLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.PROFILE} replace />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
