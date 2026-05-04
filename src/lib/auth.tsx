import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  demoMode: boolean;
  enterDemoMode: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  demoMode: false,
  enterDemoMode: () => {},
  signOut: async () => {},
});

const DEMO_USER: Partial<User> = {
  id: 'demo-user',
  email: 'demo@1stayz.com',
  user_metadata: { full_name: 'Pastor Ray' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(() => sessionStorage.getItem('1stayz_demo') === '1');

  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const { error } = await supabase.auth.getUser();
        if (error) {
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(data.session);
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [demoMode]);

  const enterDemoMode = () => {
    sessionStorage.setItem('1stayz_demo', '1');
    setDemoMode(true);
    setLoading(false);
  };

  const signOut = async () => {
    if (demoMode) {
      sessionStorage.removeItem('1stayz_demo');
      setDemoMode(false);
      return;
    }
    await supabase.auth.signOut();
  };

  const effectiveUser = demoMode ? (DEMO_USER as User) : (session?.user ?? null);

  return (
    <AuthContext.Provider value={{ session, user: effectiveUser, loading, demoMode, enterDemoMode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
