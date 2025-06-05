import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/logo.png';
import { ClipboardDocumentListIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, BoltIcon, UserCircleIcon } from '@heroicons/react/24/solid';

export default function Index() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    document.title = 'LinkOut';
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
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
    <div className="min-h-screen w-screen min-w-screen bg-neutral-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-3 bg-neutral-900 border-b border-neutral-800 shadow-sm relative">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full bg-white border-2 border-white object-contain animate-float shadow-lg" />
          <span className="font-extrabold text-xl text-white tracking-tight ml-2">LinkOut</span>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center cursor-pointer group">
              <ClipboardDocumentListIcon className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors duration-200" />
              <span className="font-bold text-sm mt-1">Candidaturas</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer group">
              <PencilSquareIcon className="w-7 h-7 text-pink-400 group-hover:text-white transition-colors duration-200" />
              <span className="font-bold text-sm mt-1">Desahógate</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer group">
              <ChatBubbleLeftRightIcon className="w-7 h-7 text-green-400 group-hover:text-white transition-colors duration-200" />
              <span className="font-bold text-sm mt-1">Ánimo IA</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer group">
              <BoltIcon className="w-7 h-7 text-yellow-300 group-hover:text-yellow-700 transition-colors duration-200" />
              <span className="font-bold text-sm mt-1">Reto físico</span>
            </div>
          </div>
        </div>
        {/* Usuario */}
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 focus:outline-none">
            <UserCircleIcon className="w-9 h-9 text-gray-300" />
            <span className="font-medium text-white hidden sm:block">{user.email}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-30">
              <div className="px-4 py-3 text-sm text-gray-200 border-b border-neutral-700">{user.email}</div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-100 hover:text-red-700 font-bold rounded-b-lg transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Bienvenida */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <h1 className="text-3xl font-extrabold text-center mb-4 tracking-tight">¡Bienvenido a tu sitio de paz, <span className="text-blue-400">{user.email}</span>!</h1>
        <p className="text-lg text-gray-300 mb-8 max-w-xl text-center font-medium">
          Aquí puedes desahogarte, recargar energías y volver a empezar con ánimo.
        </p>
        {/* Bloques de opciones */}
        <div className="w-full max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-blue-600 cursor-pointer group shadow-lg">
              <ClipboardDocumentListIcon width={32} height={32} className="mb-2 text-blue-400 group-hover:text-white transition-colors duration-200" />
              <div className="font-bold text-white text-base text-center mb-1 group-hover:text-white transition-colors duration-200">Candidaturas</div>
              <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Organiza tus aplicaciones y recupera el control.</div>
            </div>
            <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-pink-600 cursor-pointer group shadow-lg">
              <PencilSquareIcon width={32} height={32} className="mb-2 text-pink-400 group-hover:text-white transition-colors duration-200" />
              <div className="font-bold text-white text-base text-center mb-1 group-hover:text-white transition-colors duration-200">Desahógate</div>
              <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Exprésate, aquí te escuchamos.</div>
            </div>
            <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-green-600 cursor-pointer group shadow-lg">
              <ChatBubbleLeftRightIcon width={32} height={32} className="mb-2 text-green-400 group-hover:text-white transition-colors duration-200" />
              <div className="font-bold text-white text-base text-center mb-1 group-hover:text-white transition-colors duration-200">Ánimo IA</div>
              <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Recibe palabras que te animen.</div>
            </div>
            <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-yellow-400 cursor-pointer group shadow-lg">
              <BoltIcon width={32} height={32} className="mb-2 text-yellow-300 group-hover:text-yellow-700 transition-colors duration-200" />
              <div className="font-bold text-white text-base text-center mb-1 group-hover:text-yellow-700 transition-colors duration-200">Reto físico</div>
              <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Actívate y libera el estrés.</div>
            </div>
          </div>
        </div>
      </main>
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
    </div>
  );
} 