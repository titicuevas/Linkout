import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full text-center py-2 text-gray-500 text-xs bg-transparent mt-auto">
      Hecho con ❤️ para quienes buscan un nuevo comienzo. &copy; {new Date().getFullYear()} LinkOut
    </footer>
  );
} 