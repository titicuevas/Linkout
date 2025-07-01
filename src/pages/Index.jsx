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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight drop-shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
          ¡Hola, <span className="text-blue-400">{profile?.nombre || user.email}</span>!
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white animate-fade-in">Bienvenido a tu espacio de bienestar y motivación</h2>
        <div className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl text-center font-medium animate-fade-in">
          Aquí puedes organizar tus candidaturas, desahogarte, recibir palabras de ánimo y superar nuevos retos. ¡Este es tu refugio para crecer y avanzar!
        </div>
        <div className="text-pink-300 text-center font-semibold mb-10 animate-fade-in-slow text-lg flex items-center justify-center gap-2">
          <span>💡 Recuerda: ¡Tu bienestar y tu progreso son lo más importante! 🚀</span>
        </div>
        <div className="w-full max-w-5xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <Link to="/candidaturas" className="flex flex-col items-center w-full bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-blue-400/40 hover:border-blue-400 cursor-pointer group shadow-2xl border-2 border-blue-900 hover:bg-blue-900/80 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in-card">
              <ClipboardDocumentListIcon width={56} height={56} className="mb-3 text-blue-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-white transition-colors duration-200">Candidaturas</div>
              <div className="text-base text-blue-100 text-center break-words whitespace-pre-line">Organiza tus aplicaciones y recupera el control.</div>
            </Link>
            <Link to="/desahogate" className="flex flex-col items-center w-full bg-gradient-to-br from-pink-900/80 via-pink-800/70 to-pink-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-pink-400/40 hover:border-pink-400 cursor-pointer group shadow-2xl border-2 border-pink-900 hover:bg-pink-900/80 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in-card">
              <PencilSquareIcon width={56} height={56} className="mb-3 text-pink-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-white transition-colors duration-200">Desahógate</div>
              <div className="text-base text-pink-100 text-center break-words whitespace-pre-line">Exprésate, aquí te escuchamos.</div>
            </Link>
            <Link to="/animoia" className="flex flex-col items-center w-full bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-green-400/40 hover:border-green-400 cursor-pointer group shadow-2xl border-2 border-green-900 hover:bg-green-900/80 focus:outline-none focus:ring-2 focus:ring-green-400 animate-fade-in-card">
              <ChatBubbleLeftRightIcon width={56} height={56} className="mb-3 text-green-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-white transition-colors duration-200">Ánimo IA</div>
              <div className="text-base text-green-100 text-center break-words whitespace-pre-line">Recibe palabras que te animen.</div>
            </Link>
            <Link to="/retos/fisico" className="flex flex-col items-center w-full bg-gradient-to-br from-yellow-900/80 via-yellow-800/70 to-yellow-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-yellow-400/40 hover:border-yellow-400 cursor-pointer group shadow-2xl border-2 border-yellow-900 hover:bg-yellow-900/80 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-fade-in-card">
              <BoltIcon width={56} height={56} className="mb-3 text-yellow-300 group-hover:text-yellow-100 transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-yellow-100 transition-colors duration-200">Reto físico</div>
              <div className="text-base text-yellow-100 text-center break-words whitespace-pre-line">Actívate y libera el estrés con energía positiva.</div>
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