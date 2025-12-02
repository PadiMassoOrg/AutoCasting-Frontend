import { Outlet } from 'react-router-dom';

export default function EmptyLayout() {
  return (
    <div className="min-h-screen w-full bg-[var(--color-secondary-white)]">
      <main className="flex min-h-screen w-full max-w-[1366px] p-4 m-auto items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
