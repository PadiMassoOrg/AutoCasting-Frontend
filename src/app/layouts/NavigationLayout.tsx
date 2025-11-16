// src/layouts/NavigationLayout.tsx
import { Outlet } from 'react-router-dom';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import { Navbar } from './components';

export default function NavigationLayout() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden bg-[var(--color-secondary-white)]">
      <header data-site-header className="sticky top-0 z-[40] w-full bg-[var(--color-primary-white)]">
        <MaintenanceBanner />
        <Navbar id="app-navbar" />
      </header>

      <main
        id="app-scroll-root"
        className="flex-1 w-full min-w-0 max-w-[1650px] mx-auto px-4 lg:px-6 pt-4 lg:pt-6 pb-6"
      >
        <Outlet />
      </main>
    </div>
  );
}
