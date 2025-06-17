
import React, { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
import { authenticateByWallet } from '@/utils/auth/walletAuth';
import { sanitizeWalletAddress, createRateLimiter, generateSecureToken } from '@/utils/inputSanitization';

// Adjusted rate limiting to be less restrictive
const walletOperationLimiter = createRateLimiter(10, 60000); // 10 attempts per minute (increased from 3)
const authAttemptLimiter = createRateLimiter(15, 300000); // 15 attempts per 5 minutes (increased from 5)

export const useWalletAuthLogic = (
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { clearNotifications } = useRecentActivity();
  
  // Enhanced state management with better security and deduplication
  const processingRef = useRef<{ address: string; timestamp: number; nonce: string } | null>(null);
  const lastResultRef = useRef<{ address: string; exists: boolean; timestamp: number } | null>(null);
  const notificationHistoryRef = useRef<Set<string>>(new Set());
  const authStateRef = useRef<{ address: string; authenticated: boolean; timestamp: number } | null>(null);
  const failedAttemptsRef = useRef<Map<string, { count: number; lastAttempt: number }>>(new Map());

  const handleWalletConnection = async (address: string) => {
    console.log('=== SECURE WALLET AUTH START ===');
    console.log('Input address:', address);
    console.log('Is authenticated:', isAuthenticated);
    
    // Sanitize wallet address first with enhanced validation
    const sanitizedAddress = sanitizeWalletAddress(address);
    if (!sanitizedAddress) {
      console.error('❌ Invalid wallet address format');
      toast({
        title: "Invalid Wallet Address",
        description: "The wallet address format is invalid or contains malicious content.",
        variant: "destructive",
      });
      return false;
    }

    // Check for too many failed attempts with time-based reset
    const now = Date.now();
    const failedAttempts = failedAttemptsRef.current.get(sanitizedAddress);
    if (failedAttempts && failedAttempts.count >= 5) {
      // Reset failed attempts after 10 minutes
      if (now - failedAttempts.lastAttempt > 600000) {
        failedAttemptsRef.current.delete(sanitizedAddress);
      } else {
        console.log('🚫 Too many failed attempts for this address');
        toast({
          title: "Temporary Rate Limit",
          description: "Please wait a few minutes before trying again.",
          variant: "destructive",
        });
        return false;
      }
    }

    // If user is already authenticated, don't process again
    if (isAuthenticated && user) {
      console.log('✅ User already authenticated, skipping wallet auth check');
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Link wallet to profile if not already linked
      if (sanitizedAddress !== authStateRef.current?.address) {
        await linkWalletToProfile(user.id, sanitizedAddress);
        authStateRef.current = { address: sanitizedAddress, authenticated: true, timestamp: Date.now() };
      }
      return true;
    }
    
    // Enhanced rate limiting check with more generous limits
    if (!walletOperationLimiter(sanitizedAddress) || !authAttemptLimiter(sanitizedAddress)) {
      console.log('⚠️ Rate limit exceeded for wallet operations');
      // Don't show toast immediately, give user benefit of doubt
      return false;
    }

    // Generate secure nonce for this session
    const sessionNonce = generateSecureToken();

    // Check if already processing this exact address recently (within 3 seconds, reduced from 5)
    if (processingRef.current && 
        processingRef.current.address === sanitizedAddress && 
        (now - processingRef.current.timestamp) < 3000) {
      console.log('⚠️ Already processing this wallet, skipping duplicate request');
      return false;
    }
    
    // Check for recent cached results (within 60 seconds, increased from 30)
    if (lastResultRef.current && 
        lastResultRef.current.address === sanitizedAddress && 
        (now - lastResultRef.current.timestamp) < 60000) {
      const cached = lastResultRef.current;
      console.log('Using cached result:', cached);
      
      setNeedsSignup(!cached.exists);
      setExistingUser(cached.exists);
      
      if (cached.exists) {
        await attemptSecureAuthentication(sanitizedAddress);
      }
      return cached.exists;
    }
    
    // Set processing state with nonce
    processingRef.current = { address: sanitizedAddress, timestamp: now, nonce: sessionNonce };
    
    try {
      console.log('Processing secure wallet auth for:', sanitizedAddress);
      
      // Clear notifications and reset state
      clearNotifications();
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Check if wallet exists in database with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000) // Increased timeout from 10s to 15s
      );
      
      const walletCheckResult = await Promise.race([
        checkWalletExists(sanitizedAddress),
        timeoutPromise
      ]) as any;
      
      console.log('Wallet check result:', walletCheckResult);
      
      const { exists, userId } = walletCheckResult;
      
      // Cache the result with longer expiry
      lastResultRef.current = {
        address: sanitizedAddress,
        exists,
        timestamp: now
      };
      
      if (exists && userId) {
        console.log('✅ EXISTING WALLET DETECTED - Setting up for authentication...');
        setExistingUser(true);
        setNeedsSignup(false);
        
        // Clear failed attempts on success
        failedAttemptsRef.current.delete(sanitizedAddress);
        
        // Attempt secure authentication
        await attemptSecureAuthentication(sanitizedAddress);
        return true;
      } else {
        console.log('❌ NEW WALLET DETECTED');
        setNeedsSignup(true);
        setExistingUser(false);
        
        // Show notification for new wallets (once per session)
        const notificationKey = `new_wallet_${sanitizedAddress}`;
        if (!notificationHistoryRef.current.has(notificationKey)) {
          notificationHistoryRef.current.add(notificationKey);
          toast({
            title: "New Wallet Detected", 
            description: "This wallet needs to be linked to an account. Please create an account to continue.",
          });
        }
        return false;
      }
    } catch (error) {
      console.error('❌ ERROR in secure wallet check:', error);
      
      // Increment failed attempts with better tracking
      const currentFailed = failedAttemptsRef.current.get(sanitizedAddress) || { count: 0, lastAttempt: 0 };
      failedAttemptsRef.current.set(sanitizedAddress, { 
        count: currentFailed.count + 1, 
        lastAttempt: now 
      });
      
      setNeedsSignup(true);
      setExistingUser(false);
      
      // Only show error toast if this is a significant failure
      if (currentFailed.count >= 2) {
        const errorKey = `error_${sanitizedAddress}`;
        if (!notificationHistoryRef.current.has(errorKey)) {
          notificationHistoryRef.current.add(errorKey);
          toast({
            title: "Wallet Verification Issue",
            description: "Having trouble verifying wallet. Please refresh and try again.",
            variant: "destructive",
          });
        }
      }
      return false;
    } finally {
      processingRef.current = null;
      console.log('=== SECURE WALLET AUTH END ===');
    }
  };

  const attemptSecureAuthentication = async (address: string) => {
    try {
      console.log('🔐 Attempting secure authentication for wallet:', address);
      
      // Add timeout for authentication attempt
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Authentication timeout')), 20000) // Increased from 15s to 20s
      );
      
      const authResult = await Promise.race([
        authenticateByWallet(address),
        timeoutPromise
      ]) as any;
      
      if (authResult.success) {
        console.log('✅ Secure authentication successful!');
        
        // Update auth state
        authStateRef.current = { address, authenticated: true, timestamp: Date.now() };
        
        // Clear failed attempts on success
        failedAttemptsRef.current.delete(address);
        
        // Show success notification (once per session)
        const successKey = `auth_success_${address}`;
        if (!notificationHistoryRef.current.has(successKey)) {
          notificationHistoryRef.current.add(successKey);
          toast({
            title: "Welcome Back!",
            description: "Successfully signed in with your wallet.",
          });
        }
        
        // Clear processing state
        processingRef.current = null;
        
        console.log('🎉 Secure authentication complete');
        return true;
        
      } else {
        console.warn('⚠️ Secure authentication failed:', authResult.error);
        
        // Only increment failed attempts for actual auth failures, not rate limits
        if (!authResult.error?.includes('rate limit')) {
          const currentFailed = failedAttemptsRef.current.get(address) || { count: 0, lastAttempt: 0 };
          failedAttemptsRef.current.set(address, { 
            count: currentFailed.count + 1, 
            lastAttempt: Date.now() 
          });
        }
        
        const failKey = `auth_fail_${address}`;
        if (!notificationHistoryRef.current.has(failKey)) {
          notificationHistoryRef.current.add(failKey);
          
          if (authResult.error?.includes('rate limit')) {
            // Don't show rate limit toast as frequently
            console.log('Rate limit detected, authentication will retry automatically');
          } else {
            toast({
              title: "Authentication Notice",  
              description: "Wallet recognized. You may need to complete authentication manually if auto sign-in doesn't work.",
            });
          }
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Secure authentication error:', error);
      
      // Only increment for non-timeout errors
      if (!(error instanceof Error && error.message.includes('timeout'))) {
        const currentFailed = failedAttemptsRef.current.get(address) || { count: 0, lastAttempt: 0 };
        failedAttemptsRef.current.set(address, { 
          count: currentFailed.count + 1, 
          lastAttempt: Date.now() 
        });
      }
      
      // Only show error toast for significant issues
      const currentFailed = failedAttemptsRef.current.get(address);
      if (currentFailed && currentFailed.count >= 3) {
        const errorKey = `auth_error_${address}`;
        if (!notificationHistoryRef.current.has(errorKey)) {
          notificationHistoryRef.current.add(errorKey);
          
          if (error instanceof Error && error.message.includes('timeout')) {
            toast({
              title: "Connection Timeout",
              description: "Please check your connection and try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Authentication Error",
              description: "Please try connecting your wallet again.",
              variant: "destructive",
            });
          }
        }
      }
      return false;
    }
  };

  // Clean up state when user authenticates successfully
  React.useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🧹 User authenticated, cleaning up wallet auth state');
      
      // Clear processing states
      processingRef.current = null;
      lastResultRef.current = null;
      
      // Clear the signup/existing user flags
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Clear failed attempts for this session
      if (authStateRef.current?.address) {
        failedAttemptsRef.current.delete(authStateRef.current.address);
      }
      
      console.log('✅ Wallet auth state cleaned up successfully');
    }
  }, [isAuthenticated, user, setNeedsSignup, setExistingUser]);

  return {
    handleWalletConnection,
  };
};
