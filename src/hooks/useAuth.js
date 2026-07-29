import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

/**
 * Verifica la sesión activa del usuario. Si no hay sesión redirige a /login.
 * Devuelve { user, authLoading, logout } para que cada página lo consuma directamente.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
      setAuthLoading(false);
    });
  }, [navigate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }, [navigate]);

  return { user, authLoading, logout };
}
