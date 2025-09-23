import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function MainLayout() {
  return (
    <>
      <Navbar></Navbar>
      <div className="w-full flex flex-col overflow-x-hidden items-center">
        <main className="w-full min-w-0 max-w-[1650px] p-4 lg:px-6 lg:pt-6" id="app-scroll-root">
          {<Outlet />}
        </main>
      </div>
      {/* <Footer></Footer> */}
    </>
  );
}
