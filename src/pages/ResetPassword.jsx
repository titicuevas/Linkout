import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Swal from 'sweetalert2';
import logo from '../assets/Logo.png';
import { inputBase, buttonPrimary, labelBase } from '../styles/twHelpers';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import EyeIcon from '../components/EyeIcon';
import PageLoader from '../components/PageLoader';
import { mapAuthErrorMessage } from '../utils/authErrors';
import { swalSuccess, swalError } from '../utils/swalTheme';
import { validatePassword } from '../utils/validators';
import { useTitle } from '../hooks/useTitle';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const navigate = useNavigate();

  useTitle('Nueva contraseña');

  useEffect(() => {
    let active = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setCanReset(true);
        setCheckingSession(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data?.session) {
        setCanReset(true);
      }
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      await Swal.fire(swalError('Contraseña inválida', 'La contraseña debe tener al menos 8 caracteres.'));
      return;
    }

    if (password !== confirmPassword) {
      await Swal.fire(swalError('No coinciden', 'Las contraseñas no coinciden.'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await Swal.fire(swalSuccess('Contraseña actualizada', 'Ya puedes iniciar sesión con tu nueva contraseña.'));
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      await Swal.fire(swalError(
        'No se pudo actualizar',
        mapAuthErrorMessage(error, 'No se pudo guardar la nueva contraseña. Inténtalo de nuevo.'),
      ));
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return <PageLoader message="Preparando restablecimiento..." />;
  }

  if (!canReset) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-700 flex flex-col items-center text-center">
          <img src={logo} alt="Logo Linkout" className="w-20 h-20 mb-4 rounded-full bg-white border-4 border-white object-contain" />
          <h1 className="text-3xl font-extrabold text-white mb-3">Enlace no válido o caducado</h1>
          <p className="text-gray-300 mb-6">
            Solicita un nuevo correo de recuperación para poder cambiar tu contraseña.
          </p>
          <Link
            to="/forgot-password"
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Recuperar contraseña
          </Link>
          <Link to="/login" className="mt-4 text-blue-400 hover:underline text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 px-4 sm:px-6 py-8">
      <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-700 flex flex-col items-center mx-auto relative animate-fade-in">
        <img
          src={logo}
          alt="Logo Linkout"
          className="w-20 h-20 mb-4 rounded-full bg-white border-4 border-white object-contain animate-ghost-float shadow-2xl"
          style={{ marginTop: '-3rem' }}
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Nueva contraseña
        </h1>
        <div className="text-center text-gray-300 mb-6 text-base sm:text-lg">
          Elige una contraseña nueva para tu cuenta de LinkOut.
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className={labelBase}>Nueva contraseña</label>
            <div className="flex w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LockClosedIcon className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBase} flex-1 rounded-l outline-none w-full pl-10`}
                required
                autoComplete="new-password"
                minLength={8}
              />
              <button
                type="button"
                aria-label="Mostrar u ocultar contraseña"
                className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center z-10"
                style={{ height: '2.5rem' }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>
          <div>
            <label className={labelBase}>Confirmar contraseña</label>
            <div className="flex w-full relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LockClosedIcon className="w-5 h-5" />
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputBase} flex-1 rounded-l outline-none w-full pl-10`}
                required
                autoComplete="new-password"
                minLength={8}
              />
              <button
                type="button"
                aria-label="Mostrar u ocultar confirmación"
                className="rounded-r bg-neutral-700 border-t border-b border-r border-neutral-600 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-opacity opacity-60 hover:opacity-100 px-3 flex items-center z-10"
                style={{ height: '2.5rem' }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirm((v) => !v)}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${buttonPrimary} w-full bg-blue-600 hover:bg-blue-700 shadow-lg text-xl font-bold py-3 transition-all duration-300 border-2 border-blue-700`}
          >
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm w-full">
          <Link to="/login" className="text-blue-400 hover:underline">Volver al login</Link>
        </p>
      </div>
    </div>
  );
}
