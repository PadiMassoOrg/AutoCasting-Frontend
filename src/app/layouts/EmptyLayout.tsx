import { Outlet } from 'react-router-dom';

export default function EmptyLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="min-h-screen w-full flex items-center justify-center">
        {/* Aquí el wizard toma toda la pantalla */}
        <Outlet />
      </main>
    </div>
  );
}
