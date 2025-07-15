import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthenticationPage, GoogleAuthSuccessPage, ResetPasswordPage } from '../features/auth/pages';
import { PublicProfilePage } from '../features/profile/pages/';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';
import { ROUTES } from '../shared/lib/routes';
import PublicPagesLayout from '../layouts/PublicPagesLayout';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* App */}
        <Route path={ROUTES.HOME} element={<AuthenticationPage />} />
        <Route path={ROUTES.GOOGLE_OAUTH_SUCCESS} element={<GoogleAuthSuccessPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        {/* Public */}
        <Route element={<PublicPagesLayout />}>
          <Route path="/profile/:slug" element={<PublicProfilePage />} />
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
