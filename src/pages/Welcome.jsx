import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.webp';
import { useTitle } from '../hooks/useTitle';

export default function Welcome() {
  useTitle('Bienvenido');
  const navigate = useNavigate();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveWelcome() {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;

      if (data?.user) {
        navigate('/index', { replace: true });
        return;
      }

      // Da margen a que Supabase procese el token de confirmación
      window.setTimeout(async () => {
        if (cancelled) return;
        const { data: retry } = await supabase.auth.getUser();
        if (cancelled) return;
        if (retry?.user) {
          navigate('/index', { replace: true });
          return;
        }
        setStuck(true);
      }, 2500);
    }

    resolveWelcome();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
      <img src={logo} alt="Logo Linkout" className="w-24 h-24 mb-8 rounded-full shadow-2xl bg-white border-4 border-white animate-bounce" />
      <h1 className="text-4xl font-extrabold text-white mb-4 text-center drop-shadow-lg">¡Bienvenido a LinkOut!</h1>
      {stuck ? (
        <>
          <p className="text-xl text-blue-100 mb-6 text-center max-w-md">
            No hemos podido confirmar la sesión automáticamente. Inicia sesión para continuar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 text-center">
              Ir al login
            </Link>
            <Link to="/" className="rounded-full bg-neutral-700 px-6 py-3 font-bold text-white hover:bg-neutral-600 text-center">
              Volver al inicio
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-xl text-blue-100 mb-6 text-center">Accediendo a tu zona segura...</p>
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        </>
      )}
    </div>
  );
}
