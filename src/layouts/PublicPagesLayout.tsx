// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './components';

export default function PublicPagesLayout() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar></PublicNavbar>
      <main className="p-4">{<Outlet />}</main>
    </div>
  );
}
