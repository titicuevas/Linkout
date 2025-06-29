import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Layout from '../components/Layout';
import { inputBase, buttonPrimary, labelBase, errorMsg } from '../styles/twHelpers';
import logo from '../assets/Logo.png';
import ResponsiveContainer from '../components/ResponsiveContainer';

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
    <ResponsiveContainer>
      <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-2xl p-8 border border-neutral-700 flex flex-col items-center">
        <img src={logo} alt="Logo Linkout" className="w-12 h-12 mb-4 rounded-full bg-white border-2 border-white object-contain animate-float shadow-lg" />
        <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight">Registro</h1>
        {error && <div className={errorMsg}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelBase}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputBase}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelBase}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelBase}>Contraseña</label>
            <div className="flex w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase + ' flex-1 rounded-l outline-none'}
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
          </div>
          <div>
            <label className={labelBase}>Repetir contraseña</label>
            <div className="flex w-full">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputBase + ' flex-1 rounded-l outline-none'}
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
          </div>
          <button
            type="submit"
            disabled={loading}
            className={buttonPrimary}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-400 hover:underline">Inicia sesión</Link>
        </p>
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
    </ResponsiveContainer>
  );
} 