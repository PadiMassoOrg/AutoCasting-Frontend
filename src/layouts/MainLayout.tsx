// src/layouts/MainLayout.tsx
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow px-4 py-3">
        <h1 className="text-xl font-bold">🎬 AutoCasting</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
