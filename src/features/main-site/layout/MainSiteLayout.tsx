import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';
import PublicFooter from '../components/PublicFooter';

const MainSiteLayout = () => {
  return (
    <>
      <Navbar></Navbar>
      <main className="w-full pb-20 overflow-hidden" id="app-scroll-root">
        {<Outlet />}
      </main>
      <PublicFooter></PublicFooter>
    </>
  );
};

export default MainSiteLayout;
