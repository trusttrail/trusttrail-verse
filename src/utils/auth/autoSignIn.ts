
import { supabase } from "@/integrations/supabase/client";
import { checkWalletExists } from './walletProfile';

// Handle wallet auto sign-in with simplified approach for existing users
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
    
    console.log('✅ Existing user found - setting up authentication');
    return { 
      success: true, 
      userId,
      walletAddress,
      message: 'User ready for authentication'
    };
    
  } catch (error) {
    console.error('Error in handleWalletAutoSignIn:', error);
    return { 
      success: false, 
      error: 'Authentication setup failed'
    };
  }
};

// Simplified auto sign-in that just verifies the wallet exists
export const autoSignInWithWallet = async (walletAddress: string) => {
  try {
    console.log('Attempting to verify wallet for auto sign-in:', walletAddress);
    
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
    
    console.log('✅ Wallet verification successful - ready for authentication');
    return { 
      success: true, 
      userId,
      message: 'Wallet verified, ready for authentication'
    };
    
  } catch (error) {
    console.error('Error in auto sign-in with wallet:', error);
    return { success: false, error };
  }
};

// Get stored auto sign-in data
export const getAutoSignInData = () => {
  const userId = localStorage.getItem('pending_wallet_auth_user_id');
  const walletAddress = localStorage.getItem('pending_wallet_auth_address');
  return userId && walletAddress ? { userId, walletAddress } : null;
};

// Clear auto sign-in data
export const clearAutoSignInData = () => {
  localStorage.removeItem('pending_wallet_auth_user_id');
  localStorage.removeItem('pending_wallet_auth_address');
};
