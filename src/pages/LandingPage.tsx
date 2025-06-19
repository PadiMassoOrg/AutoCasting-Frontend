// src/pages/LandingPage.tsx
import { MainLayout } from '../layouts';
import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías conectar con tu API de login
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <MainLayout>
      <div className="bg-red-500 text-white p-4 rounded-lg">Hola Tailwind 4.1.10 funcionando 🚀</div>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-center mb-6">Iniciar sesión en AutoCasting</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@mail.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            ¿No tenés una cuenta?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Registrate
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
