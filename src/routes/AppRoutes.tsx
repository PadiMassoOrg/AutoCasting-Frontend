import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthenticationPage, GoogleAuthSuccessPage, ResetPasswordPage } from '../features/auth/pages';

import { PublicProfilePage } from '../features/public-profile/pages';
import { TalentDatabasePage } from '../features/talent-database/pages';
import PublicPagesLayout from '../layouts/PublicPagesLayout';
import { ScrollToTop } from '../shared/components/ScrollToTop/ScrollToTop';
import { ROUTES } from '../shared/lib/routes';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop selector="#app-scroll-root" />
      <Routes>
        {/* App */}
        <Route path={ROUTES.HOME} element={<AuthenticationPage />} />
        <Route path={ROUTES.GOOGLE_OAUTH_SUCCESS} element={<GoogleAuthSuccessPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        {/* Public */}
        <Route element={<PublicPagesLayout />}>
          <Route path="/profile/:slug" element={<PublicProfilePage />} />
          <Route path="/talent-database" element={<TalentDatabasePage />} />
        </Route>
        {/* Protected */}
        <Route
          path={ROUTES.ALL}
          element={
            <ProtectedRoute>
              <ProtectedRoutesLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
