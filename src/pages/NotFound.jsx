import { Link } from 'react-router-dom';
import logo from '../assets/Logo.webp';
import { useTitle } from '../hooks/useTitle';

export default function NotFound() {
  useTitle('Página no encontrada');

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}
    >
      <img
        src={logo}
        alt="Logo LinkOut"
        className="w-20 h-20 mb-6 rounded-full bg-white border-4 border-white object-contain shadow-2xl"
      />
      <p className="text-6xl font-extrabold text-pink-400 mb-2">404</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
        Página no encontrada
      </h1>
      <p className="text-gray-300 text-center mb-8 max-w-md">
        La ruta que buscas no existe o se ha movido. Vuelve al inicio para continuar.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg text-center transition"
        >
          Ir al inicio
        </Link>
        <Link
          to="/index"
          className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full font-bold shadow-lg text-center transition"
        >
          Ir al panel
        </Link>
      </div>
    </div>
  );
}
