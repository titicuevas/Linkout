import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.png';
import { HeartIcon, ShieldCheckIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';

export default function Home() {
  const navigate = useNavigate();
  
  useEffect(() => { 
    document.title = 'LinkOut - Tu espacio seguro para desahogarte'; 
  }, []);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate('/index');
      }
    });
  }, [navigate]);

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Fondo animado con partículas */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-10 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo y título principal */}
            <div className="mb-12">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <img 
                  src={logo} 
                  alt="LinkOut Logo" 
                  className="relative w-28 h-28 rounded-full shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm animate-float"
                />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Desahógate
                </span>
                <br />
                <span className="text-white">en LinkOut</span>
              </h1>
            </div>

            {/* Descripción principal */}
            <div className="mb-12 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed">
                ¿Te han hecho <span className="text-pink-300 font-bold">ghosting</span> en procesos de selección? 
                ¿Te han descartado sin explicación?
              </p>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Aquí puedes <span className="text-white font-semibold">desahogarte, compartir tu experiencia</span> y 
                <span className="text-white font-semibold"> recargar energías</span> para seguir buscando trabajo.
              </p>
            </div>

            {/* Botón principal */}
            <div className="mb-16">
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-500 font-bold text-xl border-0 outline-none focus:ring-4 focus:ring-purple-300/50 transform hover:scale-105 hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <HeartIcon className="w-6 h-6" />
                  ¡Quiero desahogarme de mi experiencia laboral!
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </Link>
            </div>

            {/* Características */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Espacio Seguro</h3>
                <p className="text-gray-300 text-sm">Comparte sin miedo, tu privacidad está protegida</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Comunidad</h3>
                <p className="text-gray-300 text-sm">Conecta con personas que han pasado por lo mismo</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Renovación</h3>
                <p className="text-gray-300 text-sm">Recarga energías y prepárate para nuevos retos</p>
              </div>
            </div>

            {/* Mensaje final */}
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <p className="text-lg text-gray-200 mb-2">
                Tu espacio seguro para expresar lo que sientes y empezar de nuevo.
              </p>
              <p className="text-xl font-bold text-white">
                <span className="text-pink-300">No estás solo/a.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Estilos CSS personalizados */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(1deg); }
            50% { transform: translateY(-20px) rotate(0deg); }
            75% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          
          .animate-pulse {
            animation: pulse 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </Layout>
  );
} 