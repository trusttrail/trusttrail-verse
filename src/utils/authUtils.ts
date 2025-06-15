
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
  
  // Clear wallet connection state
  localStorage.removeItem('wallet_disconnected');
  localStorage.removeItem('connected_wallet_address');
};

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

export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Check if wallet address exists in profiles table
export const checkWalletExists = async (walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('wallet_address', walletAddress)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking wallet:', error);
      return { exists: false, userId: null };
    }
    
    return { exists: !!data, userId: data?.id || null };
  } catch (error) {
    console.error('Error checking wallet exists:', error);
    return { exists: false, userId: null };
  }
};

// Update user profile with wallet address after signup
export const linkWalletToProfile = async (userId: string, walletAddress: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error linking wallet to profile:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error linking wallet to profile:', error);
    return { success: false, error };
  }
};

// Auto sign-in user with wallet (for existing users)
export const autoSignInWithWallet = async (walletAddress: string) => {
  try {
    // First check if wallet exists
    const { exists, userId } = await checkWalletExists(walletAddress);
    
    if (!exists || !userId) {
      return { success: false, error: 'Wallet not found' };
    }

    // For security, we won't actually auto-sign them in automatically
    // Instead, we'll just indicate that this wallet is recognized
    // and guide them to the normal sign-in flow
    return { 
      success: true, 
      recognized: true, 
      message: 'Wallet recognized - please sign in with your email and password' 
    };
    
  } catch (error) {
    console.error('Error in auto sign-in with wallet:', error);
    return { success: false, error };
  }
};

// Sign in user with existing wallet
export const signInWithWallet = async (userId: string) => {
  try {
    // This would typically involve a custom authentication flow
    // For now, we'll check if user exists and guide them to normal sign in
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      return { success: false, error: 'Profile not found' };
    }
    
    return { success: true, profile };
  } catch (error) {
    console.error('Error signing in with wallet:', error);
    return { success: false, error };
  }
};
