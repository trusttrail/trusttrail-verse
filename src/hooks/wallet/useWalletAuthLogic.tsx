
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
import { useWalletSecurity } from './auth/useWalletSecurity';
import { useWalletCache } from './auth/useWalletCache';
import { useWalletAuthentication } from './auth/useWalletAuthentication';

export const useWalletAuthLogic = (
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { user, isAuthenticated } = useAuth();
  
  // Safe access to useRecentActivity with fallback
  let clearNotifications = () => {};
  try {
    const recentActivity = useRecentActivity();
    clearNotifications = recentActivity.clearNotifications;
  } catch (error) {
    console.warn('RecentActivity provider not available yet, using fallback');
  }
  
  const {
    sanitizeAndValidateWallet,
    checkRateLimit,
    recordFailedAttempt,
    clearFailedAttempts,
    showNotificationOnce,
    generateSessionNonce,
  } = useWalletSecurity();

  const {
    isProcessing,
    getCachedResult,
    setProcessing,
    clearProcessing,
    setCachedResult,
    setAuthState,
    getAuthState,
    clearAllCache,
  } = useWalletCache();

  const { attemptSecureAuthentication } = useWalletAuthentication();

  const handleWalletConnection = async (address: string) => {
    console.log('=== SECURE WALLET AUTH START ===');
    console.log('Is authenticated:', isAuthenticated);
    
    // Sanitize and validate wallet address
    const sanitizedAddress = sanitizeAndValidateWallet(address);
    if (!sanitizedAddress) return false;

    // If user is already authenticated, don't process again
    if (isAuthenticated && user) {
      console.log('✅ User already authenticated, skipping wallet auth check');
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Link wallet to profile if not already linked
      const authState = getAuthState();
      if (sanitizedAddress !== authState?.address) {
        await linkWalletToProfile(user.id, sanitizedAddress);
        setAuthState(sanitizedAddress, true);
      }
      return true;
    }
    
    // Check rate limits and failed attempts
    if (!checkRateLimit(sanitizedAddress)) {
      return false;
    }

    // Check if already processing this exact address recently
    if (isProcessing(sanitizedAddress)) {
      console.log('⚠️ Already processing this wallet, skipping duplicate request');
      return false;
    }
    
    // Check for recent cached results
    const cached = getCachedResult(sanitizedAddress);
    if (cached) {
      console.log('Using cached result:', cached);
      
      setNeedsSignup(!cached.exists);
      setExistingUser(cached.exists);
      
      if (cached.exists) {
        await performAuthentication(sanitizedAddress);
      }
      return cached.exists;
    }
    
    // Set processing state with nonce
    const sessionNonce = generateSessionNonce();
    setProcessing(sanitizedAddress, sessionNonce);
    
    try {
      console.log('Processing secure wallet auth for:', sanitizedAddress);
      
      // Clear notifications and reset state
      clearNotifications();
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Check if wallet exists in database with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const walletCheckResult = await Promise.race([
        checkWalletExists(sanitizedAddress),
        timeoutPromise
      ]) as any;
      
      console.log('Wallet check result:', walletCheckResult);
      
      const { exists, userId } = walletCheckResult;
      
      // Cache the result
      setCachedResult(sanitizedAddress, exists);
      
      if (exists && userId) {
        console.log('✅ EXISTING WALLET DETECTED - Setting up for authentication...');
        setExistingUser(true);
        setNeedsSignup(false);
        
        clearFailedAttempts(sanitizedAddress);
        await performAuthentication(sanitizedAddress);
        return true;
      } else {
        console.log('❌ NEW WALLET DETECTED');
        setNeedsSignup(true);
        setExistingUser(false);
        
        showNotificationOnce(
          `new_wallet_${sanitizedAddress}`,
          "New Wallet Detected",
          "This wallet needs to be linked to an account. Please create an account to continue."
        );
        return false;
      }
    } catch (error) {
      console.error('❌ ERROR in secure wallet check:', error);
      
      recordFailedAttempt(sanitizedAddress);
      setNeedsSignup(true);
      setExistingUser(false);
      
      showNotificationOnce(
        `error_${sanitizedAddress}`,
        "Wallet Verification Issue",
        "Having trouble verifying wallet. Please refresh and try again.",
        "destructive"
      );
      return false;
    } finally {
      clearProcessing();
      console.log('=== SECURE WALLET AUTH END ===');
    }
  };

  const performAuthentication = async (address: string) => {
    return attemptSecureAuthentication(
      address,
      (successAddress) => {
        setAuthState(successAddress, true);
        clearFailedAttempts(successAddress);
        clearProcessing();
      },
      (failAddress, error) => {
        if (!error?.includes('rate limit')) {
          recordFailedAttempt(failAddress);
        }
      }
    );
  };

  // Clean up state when user authenticates successfully
  React.useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🧹 User authenticated, cleaning up wallet auth state');
      
      clearAllCache();
      setNeedsSignup(false);
      setExistingUser(false);
      
      const authState = getAuthState();
      if (authState?.address) {
        clearFailedAttempts(authState.address);
      }
      
      console.log('✅ Wallet auth state cleaned up successfully');
    }
  }, [isAuthenticated, user, setNeedsSignup, setExistingUser]);

  return {
    handleWalletConnection,
  };
};
