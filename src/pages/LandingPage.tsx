import { Button } from 'autocasting-ui-library';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-md p-10 border border-slate-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Bienvenido a Auto Casting</h1>
          <p className="text-lg text-slate-600">
            Una plataforma moderna para actores y castineras. Creá tu perfil, compartilo fácilmente, y conectá con
            oportunidades reales.
          </p>
        </div>
        <Button variant="primary">Hola</Button>
      </div>
    </div>
  );
}
