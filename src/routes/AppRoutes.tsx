// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
