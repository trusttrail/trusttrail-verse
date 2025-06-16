
import React, { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
import { authenticateByWallet } from '@/utils/auth/walletAuth';
import { sanitizeWalletAddress, createRateLimiter } from '@/utils/inputSanitization';

// Create rate limiter for wallet operations
const walletOperationLimiter = createRateLimiter(3, 60000); // 3 attempts per minute

export const useWalletAuthLogic = (
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { clearNotifications } = useRecentActivity();
  
  // Enhanced state management with better deduplication
  const processingRef = useRef<{ address: string; timestamp: number } | null>(null);
  const lastResultRef = useRef<{ address: string; exists: boolean; timestamp: number } | null>(null);
  const notificationHistoryRef = useRef<Set<string>>(new Set());
  const authStateRef = useRef<{ address: string; authenticated: boolean; timestamp: number } | null>(null);

  const handleWalletConnection = async (address: string) => {
    console.log('=== SECURE WALLET AUTH START ===');
    console.log('Input address:', address);
    console.log('Is authenticated:', isAuthenticated);
    
    // Sanitize wallet address first
    const sanitizedAddress = sanitizeWalletAddress(address);
    if (!sanitizedAddress) {
      console.error('❌ Invalid wallet address format');
      toast({
        title: "Invalid Wallet Address",
        description: "The wallet address format is invalid.",
        variant: "destructive",
      });
      return false;
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
    
    // Rate limiting check
    if (!walletOperationLimiter(sanitizedAddress)) {
      console.log('⚠️ Rate limit exceeded for wallet operations');
      return false;
    }

    // Check if already processing this exact address recently (within 5 seconds)
    const now = Date.now();
    if (processingRef.current && 
        processingRef.current.address === sanitizedAddress && 
        (now - processingRef.current.timestamp) < 5000) {
      console.log('⚠️ Already processing this wallet, skipping duplicate request');
      return false;
    }
    
    // Check for recent cached results (within 30 seconds)
    if (lastResultRef.current && 
        lastResultRef.current.address === sanitizedAddress && 
        (now - lastResultRef.current.timestamp) < 30000) {
      const cached = lastResultRef.current;
      console.log('Using cached result:', cached);
      
      setNeedsSignup(!cached.exists);
      setExistingUser(cached.exists);
      
      if (cached.exists) {
        await attemptSecureAuthentication(sanitizedAddress);
      }
      return cached.exists;
    }
    
    // Set processing state
    processingRef.current = { address: sanitizedAddress, timestamp: now };
    
    try {
      console.log('Processing secure wallet auth for:', sanitizedAddress);
      
      // Clear notifications and reset state
      clearNotifications();
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Check if wallet exists in database
      const walletCheckResult = await checkWalletExists(sanitizedAddress);
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
      setNeedsSignup(true);
      setExistingUser(false);
      
      const errorKey = `error_${sanitizedAddress}`;
      if (!notificationHistoryRef.current.has(errorKey)) {
        notificationHistoryRef.current.add(errorKey);
        toast({
          title: "Wallet Verification Failed",
          description: "Unable to verify wallet status. Please try again.",
          variant: "destructive",
        });
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
      
      const authResult = await authenticateByWallet(address);
      
      if (authResult.success) {
        console.log('✅ Secure authentication successful!');
        
        // Update auth state
        authStateRef.current = { address, authenticated: true, timestamp: Date.now() };
        
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
        
        const failKey = `auth_fail_${address}`;
        if (!notificationHistoryRef.current.has(failKey)) {
          notificationHistoryRef.current.add(failKey);
          
          if (authResult.error?.includes('rate limit')) {
            toast({
              title: "Rate Limit Exceeded",  
              description: "Too many authentication attempts. Please wait before trying again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Auto Sign-In Failed",  
              description: "Your wallet is recognized but auto sign-in failed. Please try the manual sign-in button.",
              variant: "destructive",
            });
          }
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Secure authentication error:', error);
      
      const errorKey = `auth_error_${address}`;
      if (!notificationHistoryRef.current.has(errorKey)) {
        notificationHistoryRef.current.add(errorKey);
        toast({
          title: "Authentication Error",
          description: "Failed to sign in automatically. Please try the manual sign-in button.",
          variant: "destructive",
        });
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
      
      // Don't clear notification history to prevent spam
      console.log('✅ Wallet auth state cleaned up successfully');
    }
  }, [isAuthenticated, user, setNeedsSignup, setExistingUser]);

  return {
    handleWalletConnection,
  };
};
