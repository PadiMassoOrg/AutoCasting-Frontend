import { Outlet } from 'react-router-dom';
import { Footer } from '../shared/components/Footer';
import { DesktopSidebar, MobileSidebar } from './components/';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <MobileSidebar />
      <DesktopSidebar />
      <main className="pt-4 px-4 min-w-0 overflow-x-hidden min-h-screen md:ml-[264px] md:pb-20 md:mt-4 ">
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
}
