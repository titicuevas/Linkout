import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.png';
import Layout from '../components/Layout';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { document.title = 'LinkOut'; }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate('/index');
      }
    });
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'signup' && params.get('access_token')) {
      navigate('/welcome');
    }
  }, [location, navigate]);

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <img 
          src={logo} 
          alt="Logo Linkout" 
          className="w-32 h-32 mb-8 rounded-full shadow-2xl bg-white border-4 border-white object-contain animate-ghost-float"
          style={{animation: 'ghost-float 2.8s ease-in-out infinite', marginTop: '2rem'}}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg">Desahógate en LinkOut</h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl text-center font-medium">
          ¿Te han hecho <span className='text-pink-300 font-bold'>ghosting</span> en procesos de selección? ¿Te han descartado sin explicación? <br />
          <span className="text-white font-semibold">Aquí puedes desahogarte, compartir tu experiencia y recargar energías para seguir buscando trabajo.</span>
        </p>
        <Link
          to="/login"
          className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500 hover:from-pink-500 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 font-extrabold text-xl border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 text-center drop-shadow-lg tracking-wide hover:text-yellow-200 focus:text-yellow-200"
          style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.18)'}}
        >
          ¡Quiero desahogarme de mi experiencia laboral!
        </Link>
        <p className="mt-12 text-lg text-blue-200 text-center max-w-xl font-medium">
          Tu espacio seguro para expresar lo que sientes y empezar de nuevo.<br />
          <span className="font-bold text-pink-200">No estás solo/a.</span>
        </p>
        <style>{`
          @keyframes ghost-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-32px); }
            100% { transform: translateY(0px); }
          }
          .animate-ghost-float {
            animation: ghost-float 2.8s ease-in-out infinite;
          }
        `}</style>
      </div>
    </Layout>
  );
} 