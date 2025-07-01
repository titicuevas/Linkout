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
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight drop-shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
          ¡Hola, <span className="text-blue-400">{profile?.nombre || user.email}</span>!
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 animate-fade-in">Bienvenido a tu sitio de paz</h2>
        <div className="text-base sm:text-lg text-gray-300 mb-6 max-w-xl text-center font-medium animate-fade-in">
          Aquí puedes desahogarte, recargar energías y volver a empezar con ánimo.
        </div>
        <div className="text-pink-300 text-center font-semibold mb-10 animate-fade-in-slow">Recuerda: ¡Tu bienestar es lo primero! 🚀</div>
        <div className="w-full max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <Link to="/candidaturas" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 sm:p-8 transition-transform hover:scale-105 hover:shadow-pink-500/30 hover:border-blue-400 cursor-pointer group shadow-2xl border-2 border-neutral-800 hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in-card">
              <ClipboardDocumentListIcon width={48} height={48} className="mb-2 text-blue-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-white transition-colors duration-200">Candidaturas</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Organiza tus aplicaciones y recupera el control.</div>
            </Link>
            <Link to="/desahogate" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 sm:p-8 transition-transform hover:scale-105 hover:shadow-pink-500/30 hover:border-pink-400 cursor-pointer group shadow-2xl border-2 border-neutral-800 hover:bg-pink-900/60 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in-card">
              <PencilSquareIcon width={48} height={48} className="mb-2 text-pink-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-white transition-colors duration-200">Desahógate</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Exprésate, aquí te escuchamos.</div>
            </Link>
            <Link to="/animoia" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 sm:p-8 transition-transform hover:scale-105 hover:shadow-pink-500/30 hover:border-green-400 cursor-pointer group shadow-2xl border-2 border-neutral-800 hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-400 animate-fade-in-card">
              <ChatBubbleLeftRightIcon width={48} height={48} className="mb-2 text-green-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-white transition-colors duration-200">Ánimo IA</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Recibe palabras que te animen.</div>
            </Link>
            <Link to="/retos/fisico" className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-6 sm:p-8 transition-transform hover:scale-105 hover:shadow-pink-500/30 hover:border-yellow-400 cursor-pointer group shadow-2xl border-2 border-neutral-800 hover:bg-yellow-900/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-fade-in-card">
              <BoltIcon width={48} height={48} className="mb-2 text-yellow-300 group-hover:text-yellow-100 transition-colors duration-200 drop-shadow-lg" />
              <div className="font-bold text-white text-lg text-center mb-1 group-hover:text-yellow-100 transition-colors duration-200">Reto físico</div>
              <div className="text-base text-gray-300 text-center break-words whitespace-pre-line">Actívate y libera el estrés...</div>
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.7s; }
        @keyframes fade-in-card { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fade-in-card { animation: fade-in-card 1.2s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </Layout>
  );
} 