// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { MobileSidebar, DesktopSidebar } from './components/';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row pb-10">
      <MobileSidebar />
      <DesktopSidebar />
      <main className="flex-1 p-4 min-w-0 md:ml-56">{<Outlet />}</main>
    </div>
  );
}
