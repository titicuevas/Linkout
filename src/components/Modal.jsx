import React, { useEffect, useState } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  const [show, setShow] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      // Espera la animación antes de desmontar
      const timeout = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-neutral-900 rounded-lg shadow-xl p-8 relative min-w-[320px] max-w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
} 