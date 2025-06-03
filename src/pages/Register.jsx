import { useState } from 'react';
import { supabase } from '../services/supabase';
import { Link } from 'react-router-dom';

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

  const validateEmail = (email) => {
    // Expresión regular básica para emails
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
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setError('El correo ya está registrado. Inicia sesión.');
        } else {
          setError(error.message);
        }
        return;
      }
      alert('Registro exitoso. Por favor, verifica tu correo electrónico.');
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen min-w-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-2 py-4">
      <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-2xl p-8 border border-neutral-700">
        <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight">Registro</h1>
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4 animate-pulse">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
              autoComplete="email"
            />
          </div>
          <div className="flex w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-2 rounded-l bg-neutral-700 border border-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label="Mostrar u ocultar contraseña"
              className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-0 ring-0 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center"
              style={{height: '2.5rem'}}
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowPassword(v => !v)}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <div className="flex w-full">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 p-2 rounded-l bg-neutral-700 border border-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label="Mostrar u ocultar contraseña"
              className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-0 ring-0 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center"
              style={{height: '2.5rem'}}
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowConfirm(v => !v)}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 hover:from-pink-400 hover:to-blue-400 text-white rounded-full font-bold shadow-lg transition-all text-lg border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 drop-shadow-lg tracking-wide"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
      <footer className="w-full text-center py-2 text-gray-500 text-xs bg-transparent mt-auto">
        Hecho con ❤️ para quienes buscan un nuevo comienzo. &copy; {new Date().getFullYear()} LinkOut
      </footer>
    </div>
  );
} 