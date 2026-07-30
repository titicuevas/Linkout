import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white w-full overflow-x-hidden">
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar user={user} onLogout={onLogout} />
      <main id="main-content" className="flex-1 flex flex-col justify-center items-center w-full" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
