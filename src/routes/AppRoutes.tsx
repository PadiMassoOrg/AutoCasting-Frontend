import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthenticationPage } from '../features/auth/pages';
import ProtectedRoute from './ProtectedRoute';
import ProtectedRoutesLayout from './ProtectedRoutesLayout';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
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
