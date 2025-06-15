
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

// Auto sign-in existing user with wallet (simplified approach)
export const autoSignInWithWallet = async (walletAddress: string) => {
  try {
    console.log('Attempting auto sign-in for wallet:', walletAddress);
    
    // Check if wallet exists and get user ID
    const { exists, userId } = await checkWalletExists(walletAddress);
    
    if (!exists || !userId) {
      console.log('Wallet not found in database');
      return { success: false, error: 'Wallet not found' };
    }

    console.log('Wallet found for user:', userId);
    
    // Since we can't directly create a session without credentials,
    // we'll store the user ID temporarily and guide them to auto-fill their credentials
    localStorage.setItem('auto_signin_user_id', userId);
    localStorage.setItem('auto_signin_wallet', walletAddress);
    
    return { 
      success: true, 
      userId,
      shouldAutoSignIn: true,
      message: 'Wallet recognized - auto sign-in ready'
    };
    
  } catch (error) {
    console.error('Error in auto sign-in with wallet:', error);
    return { success: false, error };
  }
};

// Get stored auto sign-in data
export const getAutoSignInData = () => {
  const userId = localStorage.getItem('auto_signin_user_id');
  const walletAddress = localStorage.getItem('auto_signin_wallet');
  return userId && walletAddress ? { userId, walletAddress } : null;
};

// Clear auto sign-in data
export const clearAutoSignInData = () => {
  localStorage.removeItem('auto_signin_user_id');
  localStorage.removeItem('auto_signin_wallet');
};

// Sign in user with existing wallet - this should trigger automatic redirect to main app
export const handleWalletAutoSignIn = async (walletAddress: string) => {
  try {
    const result = await autoSignInWithWallet(walletAddress);
    
    if (result.success && result.shouldAutoSignIn) {
      // Redirect to auth page where they'll be automatically signed in
      setTimeout(() => {
        window.location.href = '/auth?auto_signin=true';
      }, 1000);
      return { success: true, redirecting: true };
    }
    
    return result;
  } catch (error) {
    console.error('Error handling wallet auto sign-in:', error);
    return { success: false, error };
  }
};
