import { Outlet } from 'react-router-dom';
import { Footer } from '../shared/components/Footer';
import { MobileSidebar } from './components/';

export default function DashboardLayout() {
  return (
    <div
      className={`
          flex flex-col overflow-x-hidden
        `}
    >
      <MobileSidebar />
      <main
        className={`
          pt-4 px-4 min-w-0 overflow-x-hidden min-h-screen
        `}
      >
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
}
