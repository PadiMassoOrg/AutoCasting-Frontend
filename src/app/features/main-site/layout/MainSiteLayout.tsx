import { Outlet } from 'react-router-dom';
import { Navbar } from '../../../layouts/components';
import { useChromeBoxHeights } from '../../../shared/hooks/useChomeBoxHeights';
import PublicFooter from '../components/PublicFooter';

const MainSiteLayout = () => {
  const { header } = useChromeBoxHeights();
  const topSpacing = header + 56;

  return (
    <div className="min-h-screen flex flex-col">
      <header data-site-header className="fixed inset-x-0 top-0 z-[80]">
        <Navbar />
      </header>
      <main className="w-full flex-1" style={{ paddingTop: `${topSpacing}px` }}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default MainSiteLayout;
