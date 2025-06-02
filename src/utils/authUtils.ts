
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
  console.log('Cleaning up auth state');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('Removing auth key:', key);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log('Removing session auth key:', key);
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const performGlobalSignOut = async () => {
  try {
    console.log('Performing global sign out');
    cleanupAuthState();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.warn('Global sign out warning:', error);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error during global sign out:', error);
    return { success: false, error };
  }
};

export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};
