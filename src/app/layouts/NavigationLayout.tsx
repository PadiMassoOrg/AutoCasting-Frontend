import { Outlet } from 'react-router-dom';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import { Navbar } from './components';

export default function NavigationLayout() {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[var(--color-secondary-white)]">
      <header data-site-header className="z-[40] w-full bg-[var(--color-primary-white)]">
        <MaintenanceBanner />
        <Navbar id="app-navbar" />
      </header>

      <main data-scroll-root className="flex-1 w-full min-w-0 overflow-y-auto">
        <div className="w-full max-w-[1650px] mx-auto px-4 lg:px-6 pt-4 lg:pt-6 pb-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
