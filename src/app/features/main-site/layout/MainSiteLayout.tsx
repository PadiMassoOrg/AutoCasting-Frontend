import { Outlet } from 'react-router-dom';
import { Navbar } from '../../../layouts/components';
import { useChromeBoxHeights } from '../../../shared/hooks/useChomeBoxHeights';
import PublicFooter from '../components/PublicFooter';

const MainSiteLayout = () => {
  const { header } = useChromeBoxHeights();

  return (
    <>
      <header data-site-header className="fixed inset-x-0 top-0 z-[80]">
        <Navbar />
      </header>
      <main className="w-full min-h-[75vh]" style={{ paddingTop: `${header}px` }}>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
};

export default MainSiteLayout;
