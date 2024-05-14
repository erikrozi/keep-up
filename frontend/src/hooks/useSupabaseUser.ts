// useSupabaseUser.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase.ts';

const useSupabaseUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setError(error);
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  return { user, loading, error };
};

export default useSupabaseUser;
