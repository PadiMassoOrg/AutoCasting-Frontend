import { useViewportVhVar } from 'autocasting-ui-library-padimasso';
import type { ReactNode } from 'react';
import { MaintenanceBanner } from '../shared/components/MaintenanceBanner/MaintenanceBanner';
import { useChromeBoxHeights } from '../shared/hooks/useChomeBoxHeights';
import Navbar from './components/Navbar';

type DocumentScrollLayoutProps = {
  children: ReactNode;
  contentClassName: string;
};

export default function DocumentScrollLayout({ children, contentClassName }: DocumentScrollLayoutProps) {
  useViewportVhVar();
  const { header, footer } = useChromeBoxHeights();

  return (
    <div className="w-full min-h-[calc(var(--app-vh,1vh)*100)] bg-(--color-secondary-white)">
      <header data-site-header className="fixed inset-x-0 top-0 z-[80]">
        <MaintenanceBanner />
        <Navbar id="app-navbar" />
      </header>

      <main
        className="w-full"
        style={{
          paddingTop: `${header}px`,
          paddingBottom: `${footer}px`,
        }}
      >
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
