import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthenticationPage } from '../features/auth/pages';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';
import GoogleAuthSuccess from '../features/auth/pages/GoogleAuthSuccess';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/oauth2/success" element={<GoogleAuthSuccess />} />
        <Route
          path="/*"
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
