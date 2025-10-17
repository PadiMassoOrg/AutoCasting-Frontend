import { Outlet } from 'react-router-dom';
import { AccountSideNav } from './components';

export default function AccountSectionLayout() {
  return (
    <section className="w-full lg:h-full">
      <div className="mx-auto max-w-[1180px] px-4 lg:px-8 lg:h-full min-h-0">
        <div className="relative grid min-h-0 lg:h-full lg:grid-cols-[264px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="hidden lg:block lg:h-full min-h-0">
            <div className="h-full min-h-0 flex flex-col overflow-y-auto">
              <AccountSideNav />
            </div>
          </aside>

          {/* PANEL DERECHO */}
          <main className="min-h-0 w-full py-8 lg:pl-10">
            <Outlet />
          </main>
        </div>
      </div>
    </section>
  );
}
