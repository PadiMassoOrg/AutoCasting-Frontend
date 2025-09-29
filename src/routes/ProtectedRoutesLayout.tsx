import { Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from '../features/profile-account/pages/AccountPage';
import FaqPage from '../features/profile-account/pages/FaqPage';
import SupportPage from '../features/profile-account/pages/SupportPage';
import { ProfilePage } from '../features/profile-edit/pages';
import { ScrollContentLayout } from '../layouts';
import AccountSectionLayout from '../layouts/AccountLayout';
import { ROUTES } from '../shared/lib/routes';

export default function ProtectedRoutesLayout() {
  return (
    <Routes>
      <Route element={<ScrollContentLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.PROFILE} replace />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route element={<AccountSectionLayout />}>
          <Route path={ROUTES.ACCOUNT} element={<AccountPage />} />
          <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
          <Route path={ROUTES.FAQ} element={<FaqPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
