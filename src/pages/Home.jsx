import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.png';
import Layout from '../components/Layout';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => { document.title = 'LinkOut'; }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate('/index', { replace: true });
      } else {
        setIsCheckingAuth(false);
      }
    });
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'signup' && params.get('access_token')) {
      navigate('/welcome');
    }
  }, [location, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (isCheckingAuth) {
    return (
      <Layout>
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
          <div className="flex flex-col items-center">
            <img 
              src={logo} 
              alt="Logo Linkout" 
              className="w-32 h-32 mb-8 rounded-full shadow-2xl bg-white border-4 border-white object-contain animate-pulse"
            />
            <div className="text-white text-xl font-semibold">Verificando autenticación...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <img 
          src={logo} 
          alt="Logo Linkout" 
          className="w-32 h-32 mb-8 rounded-full shadow-2xl bg-white border-4 border-white object-contain animate-ghost-float"
          style={{animation: 'ghost-float 2.8s ease-in-out infinite', marginTop: '2rem'}}
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg">Gestiona tu búsqueda de empleo</h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl text-center font-medium">
          Organiza tus candidaturas, mantén la motivación y comparte experiencias con otros desarrolladores. <br />
          <span className="text-white font-semibold">Tu diario personal para una búsqueda de empleo más efectiva y organizada.</span>
        </p>
        <Link
          to="/login"
          className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500 hover:from-pink-500 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 font-extrabold text-xl border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 text-center drop-shadow-lg tracking-wide hover:text-yellow-200 focus:text-yellow-200"
          style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.18)'}}
        >
          ¡Comienza a organizar mi búsqueda de empleo!
        </Link>
        <p className="mt-12 text-lg text-blue-200 text-center max-w-xl font-medium">
          Tu espacio para gestionar candidaturas y mantener la motivación.<br />
          <span className="font-bold text-pink-200">Construye tu futuro profesional.</span>
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