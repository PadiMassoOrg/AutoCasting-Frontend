import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import { LG_SCREEN_SIZE, useMedia } from '../shared/hooks/useMedia';
import { useViewportVhVar } from '../shared/hooks/useViewportVhVar';
import Navbar from './components/Navbar';

export default function ScrollContentLayout() {
  useViewportVhVar();
  const { header, footer } = useChromeBoxHeights();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  const contentHeight = `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`;

  return (
    <>
      <header data-site-header className="relative z-[40]">
        <MaintenanceBanner />
        <Navbar id="app-navbar" />
      </header>

      <div
        className={isDesktop ? 'fixed inset-x-0 overflow-hidden z-0' : ''}
        style={
          isDesktop
            ? {
                top: `${header}px`,
                bottom: `${footer}px`,
                height: contentHeight,
              }
            : {
                height: contentHeight,
              }
        }
      >
        <main className="w-full min-w-0 max-w-[1650px] mx-auto h-full">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function useChromeBoxHeights() {
  const [dims, setDims] = useState({ header: 0, footer: 0 });

  useEffect(() => {
    const header = document.querySelector('[data-site-header]') as HTMLElement | null;
    const footer = document.querySelector('[data-site-footer]') as HTMLElement | null;

    const read = () =>
      setDims({
        header: header?.getBoundingClientRect().height ?? 0,
        footer: footer?.getBoundingClientRect().height ?? 0,
      });

    read();
    const roH = header ? new ResizeObserver(read) : null;
    const roF = footer ? new ResizeObserver(read) : null;
    roH?.observe(header!);
    roF?.observe(footer!);
    window.addEventListener('resize', read, { passive: true });
    return () => {
      roH?.disconnect();
      roF?.disconnect();
      window.removeEventListener('resize', read);
    };
  }, []);

  return dims;
}
