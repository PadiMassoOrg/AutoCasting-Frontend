import { useViewportVhVar } from 'autocasting-ui-library-padimasso';
import { Outlet } from 'react-router-dom';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import { useChromeBoxHeights } from '../shared/hooks/useChomeBoxHeights';
import { LG_SCREEN_SIZE, useMedia } from '../shared/hooks/useMedia';
import Navbar from './components/Navbar';

export default function ScrollContentLayout() {
  useViewportVhVar();
  const { header, footer } = useChromeBoxHeights();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const contentHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`;

  return (
    <>
      <header data-site-header className="relative z-[80]">
        <MaintenanceBanner />
        <Navbar id="app-navbar" />
      </header>

      <div
        className={isDesktop ? 'fixed inset-x-0 overflow-hidden z-[100]' : ''}
        style={
          isDesktop ? { top: `${header}px`, bottom: `${footer}px`, height: contentHeight } : { height: contentHeight }
        }
      >
        <main data-scroll-root className="w-full min-w-0 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
