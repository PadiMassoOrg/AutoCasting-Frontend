import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthenticationPage, GoogleAuthSuccessPage, ResetPasswordPage } from '../features/auth/pages';
import { PublicProfilePage } from '../features/profile/pages/';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';
import { ROUTES } from '../shared/lib/routes';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<AuthenticationPage />} />
        <Route path={ROUTES.GOOGLE_OAUTH_SUCCESS} element={<GoogleAuthSuccessPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={'/profile/:slug'} element={<PublicProfilePage />} />
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
