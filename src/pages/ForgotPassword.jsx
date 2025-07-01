import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../assets/Logo.png';
import { inputBase, buttonPrimary, labelBase } from '../styles/twHelpers';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => { document.title = 'Recuperar contraseña'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login'
      });
      if (error) throw error;
      await MySwal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Si el correo existe, recibirás un email para restablecer tu contraseña.',
        confirmButtonText: 'Aceptar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
      });
      navigate('/login');
    } catch {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar el correo. Intenta de nuevo.',
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
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 px-2 py-8">
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
            className={buttonPrimary + ' w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 shadow-lg text-xl font-bold py-3 transition-all duration-300'}
            style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.18)'}}
          >
            {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm w-full">
          <Link to="/login" className="text-blue-400 hover:underline">Volver al login</Link>
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