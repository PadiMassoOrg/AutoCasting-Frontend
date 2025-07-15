// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './components';

export default function PublicPagesLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <PublicNavbar></PublicNavbar>
      <main className="flex-1 p-4 min-w-0 md:ml-56">{<Outlet />}</main>
    </div>
  );
}
