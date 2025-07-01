import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Footer from '../components/Footer';
import { inputBase, buttonPrimary, labelBase } from '../styles/twHelpers';
import logo from '../assets/Logo.png';

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.36-2.568A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => { document.title = 'Login'; }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Introduce un correo electrónico válido.',
        confirmButtonText: 'Aceptar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      return;
    }
    if (password.length < 8) {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        confirmButtonText: 'Aceptar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          await MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo o contraseña incorrectos.',
            confirmButtonText: 'Aceptar',
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#6366f1',
          });
        } else if (error.message.toLowerCase().includes('user not found')) {
          await MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo no está registrado.',
            confirmButtonText: 'Aceptar',
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#6366f1',
          });
        } else {
          await MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            confirmButtonText: 'Aceptar',
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#6366f1',
          });
        }
        return;
      }
      await MySwal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso.',
        confirmButtonText: 'Aceptar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      navigate('/');
    } catch {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error inesperado. Intenta de nuevo.',
        confirmButtonText: 'Aceptar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-2xl p-6 sm:p-8 border border-neutral-700 flex flex-col items-center mx-auto mt-8 mb-8 sm:mt-16 sm:mb-16">
        <img src={logo} alt="Logo Linkout" className="w-16 h-16 mb-4 rounded-full bg-white border-2 border-white object-contain animate-float shadow-lg" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 tracking-tight">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className={labelBase}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase + ' w-full'}
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
                className={inputBase + ' flex-1 rounded-l outline-none w-full'}
                required
                autoComplete="current-password"
                minLength={8}
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
          <button
            type="submit"
            disabled={loading}
            className={buttonPrimary + ' w-full'}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm w-full">
          ¿No tienes una cuenta? <Link to="/register" className="text-blue-400 hover:underline">Regístrate</Link>
          <br />
          <Link to="/forgot-password" className="text-blue-400 hover:underline">¿Has olvidado tu contraseña?</Link>
        </p>
      </div>
      <Footer />
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