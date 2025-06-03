import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, BoltIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <div className="min-h-screen w-screen min-w-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-2 py-4">
      <img
        src={logo}
        alt="LinkOut Logo"
        className="w-14 h-14 mb-4 animate-float drop-shadow rounded-full border-2 border-white bg-white object-contain object-center"
      />
      <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight text-center">LinkOut</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-xl text-center font-medium">
        ¿Te sientes frustrado por entrevistas, ghosting o rechazos? <span className="text-blue-400 font-bold">Aquí puedes desahogarte y recargar energías.</span> Este es tu refugio para volver a empezar con ánimo.
      </p>
      <div className="w-full max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Candidaturas */}
          <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-blue-600 cursor-pointer group shadow-lg">
            <ClipboardDocumentListIcon width={32} height={32} className="mb-2 text-blue-400 group-hover:text-white transition-colors duration-200" />
            <div className="font-bold text-white text-base text-center mb-1 group-hover:text-white transition-colors duration-200">Candidaturas</div>
            <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Organiza tus aplicaciones y recupera el control.</div>
          </div>
          {/* Desahógate */}
          <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-pink-600 cursor-pointer group shadow-lg">
            <PencilSquareIcon width={32} height={32} className="mb-2 text-pink-400 group-hover:text-white transition-colors duration-200" />
            <div className="font-bold text-white text-base text-center mb-1 group-hover:text-white transition-colors duration-200">Desahógate</div>
            <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Exprésate, aquí te escuchamos.</div>
          </div>
          {/* Ánimo IA */}
          <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-green-600 cursor-pointer group shadow-lg">
            <ChatBubbleLeftRightIcon width={32} height={32} className="mb-2 text-green-400 group-hover:text-white transition-colors duration-200" />
            <div className="font-bold text-white text-base text-center mb-1 group-hover:text-white transition-colors duration-200">Ánimo IA</div>
            <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Recibe palabras que te animen.</div>
          </div>
          {/* Reto físico */}
          <div className="flex flex-col items-center w-full bg-neutral-800 rounded-2xl p-4 transition-transform hover:scale-105 hover:bg-yellow-400 cursor-pointer group shadow-lg">
            <BoltIcon width={32} height={32} className="mb-2 text-yellow-300 group-hover:text-yellow-700 transition-colors duration-200" />
            <div className="font-bold text-white text-base text-center mb-1 group-hover:text-yellow-700 transition-colors duration-200">Reto físico</div>
            <div className="text-sm text-gray-300 text-center break-words whitespace-pre-line">Actívate y libera el estrés.</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full mb-12">
        <Link
          to="/login"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white rounded-full shadow-2xl hover:scale-105 hover:from-pink-400 hover:to-blue-400 transition-all duration-300 font-extrabold text-lg border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 text-center drop-shadow-lg tracking-wide"
        >
          ¡Quiero sentirme mejor!
        </Link>
      </div>
      <footer className="w-full text-center py-2 text-gray-500 text-xs bg-transparent mt-4">
        Hecho con ❤️ para quienes buscan un nuevo comienzo. &copy; {new Date().getFullYear()} LinkOut
      </footer>
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
    </div>
  );
} 