
import { checkWalletExists } from './walletProfile';

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
      return { success: true };
    }
    
    return result;
  } catch (error) {
    console.error('Error handling wallet auto sign-in:', error);
    return { success: false, error };
  }
};
