import { Outlet } from 'react-router-dom';
import { Navbar } from '../../../layouts/components';
import PublicFooter from '../components/PublicFooter';

const MainSiteLayout = () => {
  return (
    <>
      <Navbar></Navbar>
      <main className="w-full overflow-hidden min-h-[75vh]" id="app-scroll-root">
        {<Outlet />}
      </main>
      <PublicFooter></PublicFooter>
    </>
  );
};

export default MainSiteLayout;
