// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { MobileSidebar, DesktopSidebar } from './components/';
import { Footer } from '../shared/components/Footer';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row">
      <MobileSidebar />
      <DesktopSidebar />
      <main className="pt-4 px-4 md:ml-66 md:pb-20 md:mt-4">{<Outlet />}</main>
      <Footer></Footer>
    </div>
  );
}
