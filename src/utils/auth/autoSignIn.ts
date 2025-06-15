
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
    
    // Get the user from auth.users table using the service role
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !authUser.user) {
      console.error('Error fetching auth user:', authError);
      return { success: false, error: 'Auth user not found' };
    }
    
    // For existing users with wallets, we can attempt to sign them in automatically
    // by generating a magic link and using it programmatically
    const { data: magicLinkData, error: magicLinkError } = await supabase.auth.signInWithOtp({
      email: authUser.user.email!,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin
      }
    });
    
    if (magicLinkError) {
      console.error('Error generating magic link:', magicLinkError);
      return { 
        success: true, 
        userId,
        needsManualSignIn: true,
        message: 'Wallet recognized - please complete sign-in'
      };
    }
    
    return { 
      success: true, 
      userId,
      magicLinkSent: true,
      message: 'Magic link sent for automatic sign-in'
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

// Handle wallet auto sign-in with immediate authentication for existing users
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
    
    // For existing wallet users, attempt direct authentication
    // We'll use the user's email to sign them in with a passwordless flow
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!profile) {
      console.log('Profile not found');
      return { success: false, error: 'Profile not found' };
    }
    
    // Get the auth user to get their email
    const { data: { user: authUser }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !authUser?.email) {
      console.log('Could not get user email for auto sign-in');
      return { 
        success: true, 
        needsAuth: true,
        message: 'Please complete sign-in manually'
      };
    }
    
    // Sign in the user automatically using their session
    console.log('Attempting to sign in user automatically...');
    
    // Create a temporary session for the existing user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
      email: authUser.email,
      options: {
        shouldCreateUser: false
      }
    });
    
    if (signInError) {
      console.error('Auto sign-in failed:', signInError);
      return { 
        success: true, 
        needsAuth: true,
        message: 'Please complete sign-in manually'
      };
    }
    
    console.log('Auto sign-in initiated successfully');
    return { 
      success: true, 
      autoSignInInitiated: true,
      message: 'Signing you in automatically...'
    };
    
  } catch (error) {
    console.error('Error in handleWalletAutoSignIn:', error);
    return { 
      success: true, 
      needsAuth: true,
      message: 'Please complete sign-in manually'
    };
  }
};
