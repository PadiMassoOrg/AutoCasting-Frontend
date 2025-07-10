import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthenticationPage } from '../features/auth/pages';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';
import GoogleAuthSuccess from '../features/auth/pages/GoogleAuthSuccess';
import { ROUTES } from '../shared/lib/routes';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<AuthenticationPage />} />
        <Route path={ROUTES.GOOGLE_OAUTH_SUCCESS} element={<GoogleAuthSuccess />} />
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
