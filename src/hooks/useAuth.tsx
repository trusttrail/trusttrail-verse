
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { cleanupAuthState, performGlobalSignOut } from '@/utils/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('useAuth - Auth state change:', { event, session, userVerified: session?.user?.email_confirmed_at });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clean up notifications only on sign out
        if (event === 'SIGNED_OUT') {
          cleanupAuthState();
        }
      }
    );

    // Get initial session
    const getSession = async () => {
      try {
        if (!mounted) return;
        
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('useAuth - Initial session check:', { 
          session, 
          error, 
          userVerified: session?.user?.email_confirmed_at 
        });
        
        if (error) {
          console.error('useAuth - Session error:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        } else {
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('useAuth - Error getting session:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('useAuth - Signing out');
      setLoading(true);
      
      // Clear states immediately to prevent UI issues
      setUser(null);
      setSession(null);
      
      const result = await performGlobalSignOut();
      return result;
    } catch (error) {
      console.error('useAuth - Error signing out:', error);
      // Force reload to clear state
      window.location.href = '/';
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
