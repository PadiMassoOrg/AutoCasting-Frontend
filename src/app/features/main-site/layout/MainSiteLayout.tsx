import { Outlet } from 'react-router-dom';
import { Navbar } from '../../../layouts/components';
import PublicFooter from '../components/PublicFooter';

const MainSiteLayout = () => {
  return (
    <>
      <Navbar />
      <main data-scroll-root className="w-full min-h-[75vh] overflow-y-auto">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
};

export default MainSiteLayout;
