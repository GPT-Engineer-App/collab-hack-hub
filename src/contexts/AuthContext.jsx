import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../integrations/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const value = {
    signIn: async (data) => {
      const { error, data: signInData } = await supabase.auth.signInWithPassword(data);
      if (!error) {
        setUser(signInData.user);
      }
      return { error, data: signInData };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
      }
      return { error };
    },
    deleteAccount: async () => {
      try {
        await supabase.auth.signOut();
        const { error } = await supabase.rpc('delete_user');
        if (error) throw error;
        setUser(null);
      } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
      }
    },
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
