import { useState } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';
import { inputBase, buttonPrimary, labelBase } from '../styles/twHelpers';
import logo from '../assets/Logo.webp';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { mapAuthErrorMessage } from '../utils/authErrors';
import EyeIcon from '../components/EyeIcon';
import { swalSuccess, swalError } from '../utils/swalTheme';
import { validateEmail, validatePassword } from '../utils/validators';
import { useTitle } from '../hooks/useTitle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useTitle('Iniciar sesión');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      await Swal.fire(swalError('Error', 'Introduce un correo electrónico válido.'));
      return;
    }
    if (!validatePassword(password)) {
      await Swal.fire(swalError('Error', 'La contraseña debe tener al menos 8 caracteres.'));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        await Swal.fire(swalError('No se pudo iniciar sesión', mapAuthErrorMessage(error, 'No se pudo iniciar sesión. Inténtalo de nuevo.')));
        return;
      }
      await Swal.fire(swalSuccess('¡Bienvenido!', 'Inicio de sesión exitoso.'));
      navigate('/index');
    } catch {
      await Swal.fire(swalError('Error de conexión', 'No pudimos completar el inicio de sesión. Comprueba tu conexión e inténtalo de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
      <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl p-5 sm:p-10 border border-neutral-700 flex flex-col items-center mx-auto mt-8 mb-8 sm:mt-16 sm:mb-16 relative animate-fade-in">
        <img src={logo} alt="Logo Linkout" className="w-20 h-20 mb-4 rounded-full bg-white border-4 border-white object-contain animate-ghost-float shadow-2xl" style={{marginTop: '-3rem'}} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Iniciar Sesión</h1>
        <div className="text-center text-gray-300 mb-6 text-base sm:text-lg">¡Bienvenido de nuevo! Accede a tu espacio seguro para desahogarte y avanzar.</div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
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
                autoComplete="current-password"
                minLength={8}
              />
              <button
                type="button"
                tabIndex={0}
                aria-label="Mostrar u ocultar contraseña"
                className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center z-10"
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
            className={buttonPrimary + ' w-full bg-blue-600 hover:bg-blue-700 shadow-lg text-xl font-bold py-3 transition-all duration-300 border-2 border-blue-700'}
            style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.12)'}}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm w-full">
          ¿No tienes una cuenta? <Link to="/register" className="text-blue-400 hover:underline">Regístrate</Link>
          <br />
          <Link to="/forgot-password" className="text-blue-400 hover:underline">¿Has olvidado tu contraseña?</Link>
        </p>
      </div>
      <div className="w-full max-w-md">
        <Footer />
      </div>
    </div>
  );
} 