// ScrollContentLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import { useViewportVhVar } from '../shared/hooks/useViewportVhVar';
import Navbar from './components/Navbar';

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

export default function ScrollContentLayout() {
  useViewportVhVar();
  const { header, footer } = useChromeBoxHeights();

  return (
    <>
      <header data-site-header className="sticky top-0 z-[200]">
        <MaintenanceBanner />
        <Navbar />
      </header>
      <div
        className="fixed inset-x-0 overflow-hidden"
        style={{
          top: `${header}px`,
          bottom: `${footer}px`,
          height: `calc(var(--app-vh, 1vh) * 100 - ${header + footer}px)`,
        }}
      >
        <main className="w-full min-w-0 h-full max-w-[1650px] mx-auto px-4 lg:px-6 pt-4 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}
