
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
        const signInResult = await signIn(userData.email, 'wallet-auth-' + generateSecureToken());
        
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

  return {
    authenticateWallet,
    isAuthenticating
  };
};
