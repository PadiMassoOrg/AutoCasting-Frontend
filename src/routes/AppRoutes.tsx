import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthenticationPage } from '../features/auth/pages';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
      </Routes>
    </Router>
  );
}
