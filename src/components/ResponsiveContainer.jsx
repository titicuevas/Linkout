import React from 'react';

export default function ResponsiveContainer({ children }) {
  return (
    <div className="min-h-screen w-screen min-w-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-2 py-4">
      {children}
    </div>
  );
} 