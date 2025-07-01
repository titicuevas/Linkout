import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { inputBase, buttonPrimary, labelBase, errorMsg } from '../styles/twHelpers';
import logo from '../assets/Logo.png';
import { LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/solid';

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.36-2.568A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
  );
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => { document.title = 'Registro'; }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Introduce un correo electrónico válido.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!nombre.trim()) {
      setError('Introduce tu nombre.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setError('El correo ya está registrado. Inicia sesión.');
        } else {
          setError(error.message);
        }
        return;
      }
      // Insertar en profiles
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          { id: user.id, email, nombre }
        ]);
        if (profileError) {
          setError('Error al crear el perfil: ' + profileError.message);
          return;
        }
      }
      await MySwal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Por favor, verifica tu correo electrónico.',
        confirmButtonText: 'Aceptar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      navigate('/');
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 px-2 py-8">
      <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-700 flex flex-col items-center mx-auto mt-8 mb-8 sm:mt-16 sm:mb-16 relative animate-fade-in">
        <img src={logo} alt="Logo Linkout" className="w-20 h-20 mb-4 rounded-full bg-white border-4 border-white object-contain animate-ghost-float shadow-2xl" style={{marginTop: '-3rem'}} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Registro</h1>
        <div className="text-center text-gray-300 mb-6 text-base sm:text-lg">Crea tu cuenta y únete a la comunidad de LinkOut.</div>
        {error && <div className={errorMsg + ' w-full text-center mb-2'}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className={labelBase}>Nombre</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon className="w-5 h-5" /></span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={inputBase + ' w-full pl-10'}
                required
                autoComplete="name"
              />
            </div>
          </div>
          <div>
            <label className={labelBase}>Correo electrónico</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><EnvelopeIcon className="w-5 h-5" /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase + ' w-full pl-10'}
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className={labelBase}>Contraseña</label>
            <div className="flex w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LockClosedIcon className="w-5 h-5" /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase + ' flex-1 rounded-l outline-none w-full pl-10'}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label="Mostrar u ocultar contraseña"
                className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-0 ring-0 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center z-10"
                style={{height: '2.5rem'}}
                onMouseDown={e => e.preventDefault()}
                onClick={() => setShowPassword(v => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>
          <div>
            <label className={labelBase}>Repetir contraseña</label>
            <div className="flex w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LockClosedIcon className="w-5 h-5" /></span>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputBase + ' flex-1 rounded-l outline-none w-full pl-10'}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label="Mostrar u ocultar contraseña"
                className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-0 ring-0 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center z-10"
                style={{height: '2.5rem'}}
                onMouseDown={e => e.preventDefault()}
                onClick={() => setShowConfirm(v => !v)}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={buttonPrimary + ' w-full bg-blue-600 hover:bg-blue-700 shadow-lg text-xl font-bold py-3 transition-all duration-300 border-2 border-blue-700'}
            style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.12)'}}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm w-full">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-400 hover:underline">Inicia sesión</Link>
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
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.7s; }
      `}</style>
    </div>
  );
} 