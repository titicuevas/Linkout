import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/Logo.webp';
import { ArrowRightOnRectangleIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { supabase } from '../services/supabase';
import Swal from 'sweetalert2';
import { swalSuccess, swalError } from '../utils/swalTheme';
import { emitProfileUpdated } from '../utils/profileEvents';
import { getDisplayName } from '../utils/displayName';

const NAV_LINKS = [
  { to: '/candidaturas', label: 'Candidaturas' },
  { to: '/desahogate', label: 'Diario' },
  { to: '/animoia', label: 'Motivación' },
  { to: '/retos/fisico', label: 'Retos' },
];

const linkClass = ({ isActive }) =>
  `text-sm font-semibold transition whitespace-nowrap ${
    isActive ? 'text-pink-300' : 'text-gray-300 hover:text-white'
  }`;

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [draftNombre, setDraftNombre] = useState('');
  const [saving, setSaving] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('nombre')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        const resolved = getDisplayName(data, user);
        setNombre(resolved === 'tú' ? '' : resolved);
        setDraftNombre(resolved === 'tú' ? '' : resolved);
      });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setEditing(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSaveNombre = async (e) => {
    e.preventDefault();
    const next = draftNombre.trim();
    if (!next) {
      await Swal.fire(swalError('Nombre vacío', 'Introduce un nombre válido.'));
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ nombre: next }).eq('id', user.id);
    if (!error) {
      await supabase.auth.updateUser({ data: { nombre: next } });
    }
    setSaving(false);

    if (error) {
      await Swal.fire(swalError('Error', 'No se pudo guardar el nombre.'));
      return;
    }

    setNombre(next);
    setEditing(false);
    emitProfileUpdated({ nombre: next });
    await Swal.fire(swalSuccess('Perfil actualizado', 'Tu nombre se ha guardado.', { timer: 1400, showConfirmButton: false }));
  };

  const displayName = nombre || getDisplayName(null, user);
  const initial = (displayName || '?').charAt(0).toUpperCase();

  return (
    <nav className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-neutral-900 border-b border-neutral-800 shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        <Link to="/index" className="flex items-center group shrink-0">
          <img src={logo} alt="Logo LinkOut" className="w-8 h-8 rounded-full bg-white border border-white object-contain cursor-pointer group-hover:scale-110 transition" />
          <span className="font-extrabold text-lg text-white tracking-tight ml-2">LinkOut</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {user && (
        <div className="relative flex items-center shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:scale-105"
            aria-label="Abrir menú de usuario"
            aria-expanded={menuOpen}
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-1rem))] max-w-sm bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 z-50 animate-fade-slide-down flex flex-col items-center py-6 px-4 gap-2" style={{ top: '48px' }}>
              <div className="absolute -top-2 right-8 w-4 h-4 bg-neutral-900 border-t border-l border-neutral-700 rotate-45 z-10"></div>
              <div className="flex flex-col items-center mb-2 w-full">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg border-4 border-white mb-2">
                  {initial}
                </div>
                {editing ? (
                  <form onSubmit={handleSaveNombre} className="w-full flex flex-col gap-2">
                    <label htmlFor="profile-nombre" className="text-xs text-gray-400 text-left">Nombre</label>
                    <input
                      id="profile-nombre"
                      value={draftNombre}
                      onChange={(e) => setDraftNombre(e.target.value)}
                      className="w-full rounded-lg bg-neutral-800 border border-neutral-600 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      autoFocus
                      maxLength={60}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDraftNombre(nombre);
                          setEditing(false);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-neutral-700 text-sm font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-sm font-bold disabled:opacity-60"
                      >
                        {saving ? '...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="text-lg font-bold text-white text-center leading-tight">{displayName}</div>
                    <div className="text-xs text-gray-400 text-center break-all">{user.email}</div>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftNombre(displayName === 'tú' ? '' : displayName);
                        setEditing(true);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-300 font-bold bg-neutral-800 hover:bg-neutral-700 rounded-lg transition text-sm"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Editar nombre
                    </button>
                  </>
                )}
              </div>

              <div className="w-full md:hidden flex flex-col gap-1 mb-2">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `w-full rounded-lg px-4 py-2 text-sm font-bold text-center transition ${
                        isActive ? 'bg-pink-600 text-white' : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
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
    </nav>
  );
}
