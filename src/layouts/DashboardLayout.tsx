// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { MobileSidebar, DesktopSidebar } from './components/';
import { Footer } from '../shared/components/Footer';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MobileSidebar />
      <DesktopSidebar />
      <main className="flex-1 pt-4 px-4 min-w-0 md:ml-56">{<Outlet />}</main>
      <Footer></Footer>
    </div>
  );
}
