import { DocumentScrollLayoutShell, useViewportVhVar } from 'autocasting-ui-library-padimasso';
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
    <DocumentScrollLayoutShell
      contentClassName={contentClassName}
      header={
        <>
          <MaintenanceBanner />
          <Navbar id="app-navbar" />
        </>
      }
      headerOffset={header}
      footerOffset={footer}
    >
      {children}
    </DocumentScrollLayoutShell>
  );
}
