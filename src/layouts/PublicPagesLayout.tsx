import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './components';

export default function PublicPagesLayout() {
  return (
    <>
      <div className="w-full mt-6">
        <PublicNavbar></PublicNavbar>
      </div>
      <div className="w-full flex flex-col overflow-x-hidden items-center">
        <main className="w-full min-w-0 max-w-[1880px] p-4 lg:p-10 lg:pt-6" id="app-scroll-root">
          {<Outlet />}
        </main>
      </div>
    </>
  );
}
