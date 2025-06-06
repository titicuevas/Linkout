import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white w-screen">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
} 