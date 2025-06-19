// src/pages/DashboardPage.tsx
import { MainLayout } from '../layouts';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Panel de Castineras</h2>
        <p className="text-gray-700">Aquí podrás buscar actores, aplicar filtros, y gestionar tus favoritos.</p>
      </div>
    </MainLayout>
  );
}
