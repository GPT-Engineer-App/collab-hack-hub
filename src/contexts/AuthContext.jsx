import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const supabase = createClient('https://bmkjdankirqsktbkgliy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2pkYW5raXJxc2t0YmtnbGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDQ2MzYsImV4cCI6MjAzODY4MDYzNn0.zQXbChBSwQh_85GHWsEHsnjdGbUiW83EOnpkOsENpPE');

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
