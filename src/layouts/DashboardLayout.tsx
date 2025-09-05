import { Outlet } from 'react-router-dom';
import { Footer } from '../shared/components/Footer';
import { MobileSidebar } from './components/';

export default function DashboardLayout() {
  return (
    <>
      <MobileSidebar />
      <div
        className={`
        w-full flex flex-col overflow-x-hidden items-center
        `}
      >
        <main
          className={`
          w-full max-w-[1880px] pt-6 px-4 min-w-0 overflow-x-hidden min-h-screen 
          lg:p-10 lg:pt-6
          `}
        >
          <Outlet />
        </main>
        <Footer></Footer>
      </div>
    </>
  );
}
