import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/Logo.png';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Obtener nombre si existe (de user.user_metadata o user.nombre)
  const nombre = user?.user_metadata?.nombre || user?.nombre || null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 shadow-sm">
      <div className="flex items-center gap-2">
        <a href="/index" className="flex items-center group">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full bg-white border border-white object-contain cursor-pointer group-hover:scale-110 transition" />
          <span className="font-extrabold text-lg text-white tracking-tight ml-2">LinkOut</span>
        </a>
      </div>
      {user && (
        <div className="relative flex items-center" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:scale-105"
            aria-label="Abrir menú de usuario"
          >
            {nombre ? nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 z-50 animate-fade-slide-down flex flex-col items-center py-6 px-4 gap-2" style={{minWidth:'260px', top: '48px'}}>
              <div className="absolute -top-2 right-8 w-4 h-4 bg-neutral-900 border-t border-l border-neutral-700 rotate-45 z-10"></div>
              <div className="flex flex-col items-center mb-2">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg border-4 border-white mb-2">
                  {nombre ? nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                {nombre && <div className="text-lg font-bold text-white text-center leading-tight">{nombre}</div>}
                <div className="text-xs text-gray-400 text-center break-all">{user.email}</div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 font-bold bg-neutral-800 hover:bg-red-600 hover:text-white rounded-lg transition text-base shadow-sm mt-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`
@keyframes fade-slide-down {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-slide-down {
  animation: fade-slide-down 0.25s ease;
}
`}</style>
    </nav>
  );
} 