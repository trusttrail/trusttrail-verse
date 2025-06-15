
import { supabase } from "@/integrations/supabase/client";
import { checkWalletExists } from './walletProfile';

// Handle wallet auto sign-in with direct authentication for existing users
export const handleWalletAutoSignIn = async (walletAddress: string) => {
  try {
    console.log('=== WALLET AUTO SIGN-IN START ===');
    console.log('Wallet address:', walletAddress);
    
    // Check if wallet exists
    const { exists, userId } = await checkWalletExists(walletAddress);
    
    if (!exists || !userId) {
      console.log('Wallet not found, no auto sign-in needed');
      return { success: false, error: 'Wallet not found' };
    }
    
    console.log('Wallet found for user:', userId);
    
    // Check if user is already signed in
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession?.user?.id === userId) {
      console.log('User already signed in');
      return { success: true, message: 'Already authenticated' };
    }
    
    console.log('✅ Existing user found - proceeding with direct authentication');
    return { 
      success: true, 
      directAuth: true,
      message: 'Existing user authenticated directly'
    };
    
  } catch (error) {
    console.error('Error in handleWalletAutoSignIn:', error);
    return { 
      success: false, 
      error: 'Authentication failed'
    };
  }
};

// Simplified auto sign-in for existing users - no magic links needed
export const autoSignInWithWallet = async (walletAddress: string) => {
  try {
    console.log('Attempting direct sign-in for wallet:', walletAddress);
    
    // Check if wallet exists and get user ID
    const { exists, userId } = await checkWalletExists(walletAddress);
    
    if (!exists || !userId) {
      console.log('Wallet not found in database');
      return { success: false, error: 'Wallet not found' };
    }

    console.log('Wallet found for user:', userId);
    
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
    
    console.log('✅ Direct authentication successful for existing user');
    return { 
      success: true, 
      userId,
      directAuth: true,
      message: 'User authenticated directly without email verification'
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
