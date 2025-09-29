import { Outlet } from 'react-router-dom';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import Navbar from './components/Navbar';

export default function NavigationLayout() {
  return (
    <>
      <header data-site-header className="sticky top-0 z-[40]">
        <MaintenanceBanner />
        <Navbar id="app-navbar"></Navbar>
      </header>
      <div className="w-full flex flex-col overflow-x-hidden items-center">
        <main className="w-full min-w-0 max-w-[1650px] p-4 lg:px-6 lg:pt-6" id="app-scroll-root">
          {<Outlet />}
        </main>
      </div>
    </>
  );
}
