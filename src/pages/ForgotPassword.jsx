import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../assets/Logo.png';
import { inputBase, buttonPrimary, labelBase } from '../styles/twHelpers';
import ResponsiveContainer from '../components/ResponsiveContainer';

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
    <ResponsiveContainer>
      <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-2xl p-8 border border-neutral-700 flex flex-col items-center">
        <img src={logo} alt="Logo Linkout" className="w-12 h-12 mb-4 rounded-full bg-white border-2 border-white object-contain animate-float shadow-lg" />
        <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight">Recuperar contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className={buttonPrimary}
          >
            {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-400 hover:underline">Volver al login</Link>
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