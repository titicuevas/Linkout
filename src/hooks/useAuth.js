import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

/**
 * Verifica la sesión activa del usuario. Si no hay sesión redirige a /login.
 * Escucha SIGNED_OUT para no quedar con sesión obsoleta.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
        return;
      }
      if (session?.user) {
        setUser(session.user);
        setAuthLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }, [navigate]);

  return { user, authLoading, logout };
}
