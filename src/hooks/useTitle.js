import { useEffect } from 'react';

const SUFFIX = 'LinkOut';

/**
 * Establece document.title con formato consistente: "Página | LinkOut".
 * Si no se pasa título, solo muestra "LinkOut".
 */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : SUFFIX;
  }, [title]);
}
