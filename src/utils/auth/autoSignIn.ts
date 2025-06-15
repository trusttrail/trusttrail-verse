
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
    
    // Get the user's email from the profiles table to attempt sign-in
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
    
    // For now, we'll use the approach of storing the wallet info and letting the user sign in manually
    // A proper implementation would require the user to have signed in at least once with email/password
    // before we can auto-sign them in with just the wallet
    localStorage.setItem('auto_signin_user_id', userId);
    localStorage.setItem('auto_signin_wallet', walletAddress);
    
    return { 
      success: true, 
      userId,
      shouldAutoSignIn: true,
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

// Sign in user with existing wallet - redirect to auth with pre-filled info
export const handleWalletAutoSignIn = async (walletAddress: string) => {
  try {
    const result = await autoSignInWithWallet(walletAddress);
    
    if (result.success && result.shouldAutoSignIn) {
      // Store the wallet info for the auth page to use
      localStorage.setItem('recognized_wallet', walletAddress);
      
      // Redirect to auth page where the user can complete sign-in
      setTimeout(() => {
        window.location.href = '/auth?wallet_recognized=true';
      }, 1500);
      
      return { success: true };
    }
    
    return result;
  } catch (error) {
    console.error('Error handling wallet auto sign-in:', error);
    return { success: false, error };
  }
};
