import { useState } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../assets/Logo.webp';
import { inputBase, buttonPrimary, labelBase } from '../styles/twHelpers';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { mapAuthErrorMessage } from '../utils/authErrors';
import { swalSuccess, swalError } from '../utils/swalTheme';
import { validateEmail } from '../utils/validators';
import { useTitle } from '../hooks/useTitle';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useTitle('Recuperar contraseña');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      await Swal.fire(swalError('Correo inválido', 'Introduce un correo electrónico válido para enviarte el enlace de recuperación.'));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      await Swal.fire(swalSuccess('Correo enviado', 'Si el correo existe, recibirás un email para restablecer tu contraseña.'));
      navigate('/login');
    } catch (error) {
      await Swal.fire(swalError('No se pudo enviar el correo', mapAuthErrorMessage(error, 'Error al enviar el correo. Intenta de nuevo.')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 px-4 sm:px-6 py-8">
      <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-700 flex flex-col items-center mx-auto mt-8 mb-8 sm:mt-16 sm:mb-16 relative animate-fade-in">
        <img src={logo} alt="Logo Linkout" className="w-20 h-20 mb-4 rounded-full bg-white border-4 border-white object-contain animate-ghost-float shadow-2xl" style={{marginTop: '-3rem'}} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Recuperar contraseña</h1>
        <div className="text-center text-gray-300 mb-6 text-base sm:text-lg">Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.</div>
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
          <button
            type="submit"
            disabled={loading}
            className={buttonPrimary + ' w-full bg-blue-600 hover:bg-blue-700 shadow-lg text-xl font-bold py-3 transition-all duration-300 border-2 border-blue-700'}
            style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.12)'}}
          >
            {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm w-full">
          <Link to="/login" className="text-blue-400 hover:underline">Volver al login</Link>
        </p>
      </div>
    </div>
  );
} 