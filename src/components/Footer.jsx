import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full text-center py-3 px-4 text-gray-300 text-xs sm:text-sm bg-transparent mt-auto leading-relaxed">
      Hecho con ❤️ para quienes buscan un nuevo comienzo. &copy; {new Date().getFullYear()} LinkOut
    </footer>
  );
} 