import { useChromeBoxHeights } from 'autocasting-ui-library-padimasso';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../../layouts/components';
import PublicFooter from '../components/PublicFooter';

const MainSiteLayout = () => {
  const { header } = useChromeBoxHeights();
  const topSpacing = header;

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
