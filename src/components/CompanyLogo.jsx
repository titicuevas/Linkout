import { memo } from 'react';

// Función para generar iniciales de la empresa como fallback
const getCompanyInitials = (companyName) => {
  if (!companyName) return '?';
  const words = companyName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
};

// Componente de logo simplificado
export const CompanyLogo = memo(({ companyName, companyUrl, className = "w-6 h-6 rounded-full" }) => {
  let logoUrl = null;
  if (companyUrl) {
    try {
      const url = new URL(companyUrl);
      const domain = url.hostname.replace('www.', '');
      logoUrl = `https://logo.clearbit.com/${domain}?size=32`;
    } catch {
      logoUrl = null;
    }
  }

  if (!logoUrl) {
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
      onError={(e) => {
        e.target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = `${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs`;
        fallback.textContent = getCompanyInitials(companyName);
        e.target.parentNode.appendChild(fallback);
      }}
      loading="lazy"
    />
  );
});

CompanyLogo.displayName = 'CompanyLogo'; 