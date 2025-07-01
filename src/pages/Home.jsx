import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.png';
import Layout from '../components/Layout';
import { HeartIcon, UsersIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'LinkOut'; }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate('/index');
      }
    });
  }, [navigate]);

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 px-4 py-8">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Logo Linkout" className="w-28 h-28 mb-6 rounded-full shadow-2xl bg-white border-4 border-white object-contain" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-4">Desahógate en LinkOut</h1>
          <p className="text-xl md:text-2xl text-blue-100 text-center max-w-2xl font-medium mb-2">
            ¿Te han hecho <span className='text-pink-300 font-bold'>ghosting</span> en procesos de selección? ¿Te han descartado sin explicación?
          </p>
          <p className="text-lg md:text-xl text-white text-center max-w-2xl font-semibold mb-6">
            Aquí puedes desahogarte, compartir tu experiencia y recargar energías para seguir buscando trabajo.
          </p>
        </div>
        {/* Botón principal */}
        <Link
          to="/login"
          className="px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 font-extrabold text-2xl border-0 outline-none focus:ring-4 focus:ring-pink-200 text-center drop-shadow-lg tracking-wide flex items-center gap-3 mb-12"
        >
          <HeartIcon className="w-7 h-7" />
          ¡Quiero desahogarme de mi experiencia laboral!
        </Link>
        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
          <div className="bg-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg border border-white/10 hover:bg-white/20 transition">
            <ShieldCheckIcon className="w-10 h-10 text-blue-300 mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Espacio Seguro</h3>
            <p className="text-blue-100 text-center text-sm">Comparte sin miedo, tu privacidad está protegida.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg border border-white/10 hover:bg-white/20 transition">
            <UsersIcon className="w-10 h-10 text-pink-300 mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Comunidad</h3>
            <p className="text-blue-100 text-center text-sm">Conecta con personas que han pasado por lo mismo.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg border border-white/10 hover:bg-white/20 transition">
            <SparklesIcon className="w-10 h-10 text-purple-300 mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Renovación</h3>
            <p className="text-blue-100 text-center text-sm">Recarga energías y prepárate para nuevos retos.</p>
          </div>
        </div>
        {/* Mensaje final */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10 max-w-xl w-full text-center">
          <p className="text-lg text-blue-200 mb-2">
            Tu espacio seguro para expresar lo que sientes y empezar de nuevo.
          </p>
          <p className="text-xl font-bold text-pink-200">
            No estás solo/a.
          </p>
        </div>
      </div>
    </Layout>
  );
} 