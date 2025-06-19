// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-md p-10 border border-slate-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Bienvenido a AutoCasting</h1>
          <p className="text-lg text-slate-600 mb-8">
            Una plataforma moderna para actores y castineras. Creá tu perfil, compartilo fácilmente, y conectá con
            oportunidades reales.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
          >
            Registrarse como Actor
          </Link>
          <Link
            to="/login"
            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-sm font-medium transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
