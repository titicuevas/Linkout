import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Espera 2 segundos y redirige al dashboard
    const timer = setTimeout(() => {
      navigate('/index');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
      <img src={logo} alt="Logo Linkout" className="w-24 h-24 mb-8 rounded-full shadow-2xl bg-white border-4 border-white animate-bounce" />
      <h1 className="text-4xl font-extrabold text-white mb-4 text-center drop-shadow-lg">¡Bienvenido a LinkOut!</h1>
      <p className="text-xl text-blue-100 mb-6 text-center">Accediendo a tu zona segura...</p>
      <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 