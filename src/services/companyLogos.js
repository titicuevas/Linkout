import { useState, useEffect } from 'react';

// Servicio para obtener logos de empresas usando Clearbit
export const getCompanyLogo = async (companyName, companyUrl = null) => {
  try {
    // Si tenemos URL, extraer el dominio
    if (companyUrl) {
      try {
        const url = new URL(companyUrl);
        const domain = url.hostname.replace('www.', '');
        return `https://logo.clearbit.com/${domain}?size=32`;
      } catch {
        // Si la URL no es válida, intentar con el nombre de la empresa
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo logo:', error);
    return null;
  }
};

// Función para generar iniciales de la empresa como fallback
export const getCompanyInitials = (companyName) => {
  if (!companyName) return '?';
  
  const words = companyName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
};

// Componente de logo con fallback - versión pequeña
export const CompanyLogo = ({ companyName, companyUrl, className = "w-6 h-6 rounded-full" }) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      if (!companyName || !companyUrl) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);
      
      try {
        const logo = await getCompanyLogo(companyName, companyUrl);
        setLogoUrl(logo);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [companyName, companyUrl]);

  if (loading) {
    return (
      <div className={`${className} bg-neutral-700 animate-pulse flex items-center justify-center`}>
        <div className="w-3 h-3 bg-neutral-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (error || !logoUrl) {
    // Fallback a iniciales
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs`}>
        {getCompanyInitials(companyName)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`Logo de ${companyName}`}
      className={`${className} object-cover bg-white`}
      onError={() => setError(true)}
    />
  );
}; 