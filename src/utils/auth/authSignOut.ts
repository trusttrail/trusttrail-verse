
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from './authCleanup';

export const performGlobalSignOut = async () => {
  try {
    console.log('Performing global sign out');
    
    // Clear wallet connection state first
    localStorage.removeItem('wallet_disconnected');
    localStorage.removeItem('connected_wallet_address');
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.warn('Global sign out warning:', error);
    }
    
    // Clear all auth state after sign out
    cleanupAuthState();
    
    // Force a complete page reload to clear all state
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
    return { success: true };
  } catch (error) {
    console.error('Error during global sign out:', error);
    // Force reload anyway to clear state
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    return { success: false, error };
  }
};
