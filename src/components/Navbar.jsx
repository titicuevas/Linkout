import React from 'react';
import logo from '../assets/logo.png';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 shadow-sm">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8 h-8 rounded-full bg-white border border-white object-contain" />
        <span className="font-extrabold text-lg text-white tracking-tight">LinkOut</span>
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{user.email}</span>
          <button
            onClick={onLogout}
            className="px-3 py-1 bg-neutral-800 text-gray-300 rounded hover:bg-red-600 hover:text-white transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
} 