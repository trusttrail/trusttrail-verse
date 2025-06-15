
import { supabase } from "@/integrations/supabase/client";
import { checkWalletExists } from './walletProfile';

// Auto sign-in existing user with wallet using magic link approach
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
    
    // Get the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('wallet_address', walletAddress)
      .single();
      
    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      return { success: false, error: 'Profile not found' };
    }
    
    // Check if user already has an active session
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession?.user?.id === userId) {
      console.log('User already has active session');
      return { 
        success: true, 
        userId,
        alreadySignedIn: true,
        message: 'Already signed in'
      };
    }
    
    // For wallet-based users, we need them to complete the sign-in manually
    // since we don't have their password for automatic sign-in
    localStorage.setItem('auto_signin_user_id', userId);
    localStorage.setItem('auto_signin_wallet', walletAddress);
    
    return { 
      success: true, 
      userId,
      needsManualSignIn: true,
      message: 'Wallet recognized - please complete sign-in'
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

// Handle wallet auto sign-in without redirect loops
export const handleWalletAutoSignIn = async (walletAddress: string) => {
  try {
    const result = await autoSignInWithWallet(walletAddress);
    
    if (result.success) {
      if (result.alreadySignedIn) {
        // User is already signed in, no need to redirect
        return { success: true, message: 'Already authenticated' };
      } else if (result.needsManualSignIn) {
        // Store the wallet info for the auth page to use
        localStorage.setItem('recognized_wallet', walletAddress);
        
        // Only redirect if we're not already on an auth-related page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth') && !currentPath.includes('/admin')) {
          setTimeout(() => {
            window.location.href = '/auth?wallet_recognized=true';
          }, 1500);
        }
        
        return { success: true, needsAuth: true };
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error handling wallet auto sign-in:', error);
    return { success: false, error };
  }
};
