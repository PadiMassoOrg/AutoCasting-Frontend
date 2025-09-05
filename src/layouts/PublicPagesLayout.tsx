// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './components';

export default function PublicPagesLayout() {
  return (
    <>
      <PublicNavbar></PublicNavbar>
      <div className="min-h-screen bg-white">
        <main className="p-4 lg:p-10 lg:pt-6" id="app-scroll-root">
          {<Outlet />}
        </main>
      </div>
    </>
  );
}
