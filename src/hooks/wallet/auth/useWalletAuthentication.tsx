
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useWalletSecurity } from './useWalletSecurity';
import { useToast } from '@/hooks/use-toast';

export const useWalletAuthentication = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { signIn } = useAuth();
  const { checkRateLimit, generateSecureToken } = useWalletSecurity();
  const { toast } = useToast();

  const authenticateWallet = useCallback(async (walletAddress: string) => {
    if (checkRateLimit('wallet_auth')) {
      return { success: false, error: 'Rate limited' };
    }

    if (!walletAddress) {
      return { success: false, error: 'No wallet address provided' };
    }

    try {
      setIsAuthenticating(true);
      console.log('🔐 Starting wallet authentication for:', walletAddress);

      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (userError) {
        console.error('Error checking user profile:', userError);
        return { success: false, error: 'Database error' };
      }

      if (userData) {
        console.log('✅ Existing user found, attempting sign in');
        
        // For existing users, we'll use a temporary email based approach
        // In a real implementation, you'd want to use a more secure method
        const tempEmail = `${walletAddress.toLowerCase()}@wallet.temp`;
        const signInResult = await signIn(tempEmail, 'wallet-auth-' + generateSecureToken());
        
        if (signInResult.success) {
          return { 
            success: true, 
            isNewUser: false, 
            userData,
            message: 'Successfully signed in!' 
          };
        } else {
          return { 
            success: false, 
            error: 'Sign in failed',
            isNewUser: false 
          };
        }
      } else {
        console.log('👤 New user detected');
        return { 
          success: true, 
          isNewUser: true, 
          message: 'New user - registration required' 
        };
      }

    } catch (error) {
      console.error('Wallet authentication error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, [checkRateLimit, generateSecureToken, signIn]);

  const attemptSecureAuthentication = useCallback(async (
    address: string,
    onSuccess: (address: string) => void,
    onError: (address: string, error: string) => void
  ) => {
    try {
      const result = await authenticateWallet(address);
      
      if (result.success && !result.isNewUser) {
        onSuccess(address);
        return true;
      } else if (result.error) {
        onError(address, result.error);
        return false;
      }
      
      return false;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
      onError(address, errorMsg);
      return false;
    }
  }, [authenticateWallet]);

  return {
    authenticateWallet,
    attemptSecureAuthentication,
    isAuthenticating
  };
};
