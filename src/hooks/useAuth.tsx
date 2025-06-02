
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { cleanupAuthState, performGlobalSignOut } from '@/utils/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth - Auth state change:', { event, session, userVerified: session?.user?.email_confirmed_at });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('useAuth - Initial session check:', { 
          session, 
          error, 
          userVerified: session?.user?.email_confirmed_at 
        });
        
        if (error) {
          console.error('useAuth - Session error:', error);
          cleanupAuthState();
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('useAuth - Error getting session:', error);
        cleanupAuthState();
      } finally {
        setLoading(false);
      }
    };

    getSession();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('useAuth - Signing out');
      setLoading(true);
      
      const result = await performGlobalSignOut();
      
      if (result.success) {
        // Force page reload for clean state
        window.location.href = '/auth';
      } else {
        console.error('Sign out failed:', result.error);
        // Force reload anyway to clear state
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('useAuth - Error signing out:', error);
      // Force reload to clear state
      window.location.href = '/auth';
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.email_confirmed_at
  };
};
