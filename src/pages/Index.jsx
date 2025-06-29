import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
// import logo from '../assets/Logo.png';
import { ClipboardDocumentListIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, BoltIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';

export default function Index() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    document.title = 'Panel | LinkOut';
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
        // Obtener perfil
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        setProfile(profileData);
      }
    });
  }, [navigate]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="min-h-screen w-full bg-neutral-900 text-white flex flex-col items-center justify-center px-2 py-4">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-tight">¡Hola, <span className="text-blue-400">{profile?.nombre || user.email}</span>!</h1>
        <h2 className="text-2xl font-bold text-center mb-6">Bienvenido a tu sitio de paz</h2>
        <p className="text-lg text-gray-300 mb-10 max-w-xl text-center font-medium">
          Aquí puedes desahogarte, recargar energías y volver a empezar con ánimo.
        </p>
        <div className="w-full max-w-5xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-8">
            <Link to="/candidaturas" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 transition-transform hover:scale-105 hover:bg-blue-700 cursor-pointer group shadow-xl border-2 border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <ClipboardDocumentListIcon width={40} height={40} className="mb-2 text-blue-400 group-hover:text-white transition-colors duration-200" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-white transition-colors duration-200">Candidaturas</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Organiza tus aplicaciones y recupera el control.</div>
            </Link>
            <Link to="/desahogate" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 transition-transform hover:scale-105 hover:bg-pink-700 cursor-pointer group shadow-xl border-2 border-transparent hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400">
              <PencilSquareIcon width={40} height={40} className="mb-2 text-pink-400 group-hover:text-white transition-colors duration-200" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-white transition-colors duration-200">Desahógate</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Exprésate, aquí te escuchamos.</div>
            </Link>
            <Link to="/animoia" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 transition-transform hover:scale-105 hover:bg-green-700 cursor-pointer group shadow-xl border-2 border-transparent hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400">
              <ChatBubbleLeftRightIcon width={40} height={40} className="mb-2 text-green-400 group-hover:text-white transition-colors duration-200" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-white transition-colors duration-200">Ánimo IA</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Recibe palabras que te animen.</div>
            </Link>
            <Link to="/retos/fisico" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 transition-transform hover:scale-105 hover:bg-orange-500 cursor-pointer group shadow-xl border-2 border-transparent hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <BoltIcon width={40} height={40} className="mb-2 text-yellow-300 group-hover:text-orange-700 transition-colors duration-200" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-orange-700 transition-colors duration-200">Reto físico</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Actívate y libera el estrés.</div>
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
} 