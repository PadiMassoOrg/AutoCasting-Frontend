import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function MainLayout() {
  return (
    <>
      <div className="w-full mt-6">
        <Navbar></Navbar>
      </div>
      <div className="w-full flex flex-col overflow-x-hidden items-center">
        <main className="w-full min-w-0 max-w-[1880px] p-4 lg:p-10 lg:pt-6" id="app-scroll-root">
          {<Outlet />}
        </main>
      </div>
    </>
  );
}
