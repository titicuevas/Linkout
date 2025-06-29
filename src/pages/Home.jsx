import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.png';
import { ClipboardDocumentListIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, BoltIcon } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';

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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 relative overflow-hidden" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto" style={{minHeight: '100vh'}}>
          <img src={logo} alt="Logo Linkout" className="w-32 h-32 mb-8 rounded-full shadow-2xl bg-white border-4 border-white animate-ghost-float" style={{marginTop: '2rem'}} />
          <h1 className="text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg" style={{letterSpacing: '-1px'}}>Desahógate en LinkOut</h1>
          <p className="text-2xl text-blue-100 mb-10 max-w-2xl text-center font-medium" style={{lineHeight: '1.3'}}>
            ¿Te han hecho <span className='text-pink-300 font-bold'>ghosting</span> en procesos de selección? ¿Te han descartado sin explicación? <br />
            <span className="text-white font-semibold">Aquí puedes desahogarte, compartir tu experiencia y recargar energías para seguir buscando trabajo.</span>
          </p>
          <Link
            to="/login"
            className="px-14 py-5 bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500 hover:from-pink-500 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all duration-300 font-extrabold text-2xl border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 text-center drop-shadow-lg tracking-wide"
            style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.18)'}}
          >
            ¡Quiero desahogarme de mi experiencia laboral!
          </Link>
          <p className="mt-12 text-lg text-blue-200 text-center max-w-xl" style={{fontWeight: 500}}>
            Tu espacio seguro para expresar lo que sientes y empezar de nuevo.<br />
            <span className="font-bold text-pink-200">No estás solo/a.</span>
          </p>
        </div>
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