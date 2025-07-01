import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import logo from '../assets/Logo.png';
import { ClipboardDocumentListIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, BoltIcon } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => { document.title = 'LinkOut'; }, []);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate('/index');
      }
    });
  }, [navigate]);

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-pink-900 relative overflow-hidden">
        {/* Imagen abstracta opcional, puedes poner una SVG en public/ y cambiar la ruta */}
        {/* <div className="absolute inset-0 opacity-30 pointer-events-none" style={{background: 'url(/abstract-bg.svg) center/cover no-repeat'}} /> */}
        <div className="z-10 flex flex-col items-center justify-center px-6 py-12">
          <img src={logo} alt="Logo Linkout" className="w-24 h-24 mb-8 rounded-full shadow-2xl bg-white border-4 border-white" />
          <h1 className="text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg">Desahógate en LinkOut</h1>
          <p className="text-2xl text-blue-100 mb-10 max-w-2xl text-center font-medium">
            ¿Te sientes frustrado, cansado o perdido? Aquí puedes soltar todo lo que llevas dentro, sin juicios, solo apoyo y energía positiva.
          </p>
          <Link
            to="/login"
            className="px-12 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-2xl transition-all duration-300 font-extrabold text-2xl border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 text-center drop-shadow-lg tracking-wide"
            style={{boxShadow: '0 4px 32px 0 rgba(236,72,153,0.25)'}}
          >
            ¡Quiero desahogarme!
          </Link>
          <p className="mt-10 text-lg text-blue-200 text-center max-w-xl">
            Tu espacio seguro para expresar lo que sientes y empezar de nuevo.<br />
            <span className="font-bold text-pink-200">No estás solo/a.</span>
          </p>
        </div>
      </div>
    </Layout>
  );
} 