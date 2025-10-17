import { Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from '../features/app/talent/talent-profile-account/pages/AccountPage';
import { ProfilePage } from '../features/app/talent/talent-profile-edit/pages';
import { ScrollContentLayout } from '../layouts';
import { ROUTES } from '../shared/lib/routes';

export default function ProtectedRoutesLayout() {
  return (
    <Routes>
      <Route element={<ScrollContentLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.TALENT} replace />} />
        <Route path={ROUTES.TALENT} element={<ProfilePage />} />
        <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
