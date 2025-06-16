
import React, { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
import { authenticateByWallet } from '@/utils/auth/walletAuth';

export const useWalletAuthLogic = (
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { clearNotifications } = useRecentActivity();
  const lastProcessedWallet = useRef<string>('');
  const processingRef = useRef<boolean>(false);
  const lastResultRef = useRef<{ address: string; exists: boolean; timestamp: number } | null>(null);
  const authAttemptRef = useRef<string>('');
  const toastShownRef = useRef<Set<string>>(new Set());
  const successfulAuthRef = useRef<Set<string>>(new Set());

  const handleWalletConnection = async (address: string) => {
    console.log('=== WALLET AUTH DEBUG START ===');
    console.log('Input address:', address);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Last processed wallet:', lastProcessedWallet.current);
    console.log('Currently processing:', processingRef.current);
    
    // If user is already authenticated, don't process again
    if (isAuthenticated) {
      console.log('✅ User already authenticated, skipping wallet auth check');
      setNeedsSignup(false);
      setExistingUser(false);
      return true;
    }
    
    // Strict duplicate prevention
    if (processingRef.current && lastProcessedWallet.current === address) {
      console.log('⚠️ Authentication already in progress for this wallet, skipping');
      return false;
    }
    
    // Check for recent results (within 10 seconds)
    if (lastResultRef.current && 
        lastResultRef.current.address === address && 
        (Date.now() - lastResultRef.current.timestamp) < 10000) {
      const cached = lastResultRef.current;
      console.log('Using cached result:', cached);
      
      if (cached.exists) {
        setExistingUser(true);
        setNeedsSignup(false);
        // Only attempt auth if not already successful for this wallet
        if (!successfulAuthRef.current.has(address) && !authAttemptRef.current) {
          await attemptAutoAuthentication(address);
        }
      } else {
        setNeedsSignup(true);
        setExistingUser(false);
      }
      return cached.exists;
    }
    
    processingRef.current = true;
    lastProcessedWallet.current = address;
    
    console.log('Processing wallet auth for:', address);
    
    clearNotifications();
    setNeedsSignup(false);
    setExistingUser(false);
    
    try {
      // If user is already authenticated, just link the wallet
      if (isAuthenticated && user) {
        console.log('User already authenticated, linking wallet to profile');
        const linkResult = await linkWalletToProfile(user.id, address);
        if (linkResult.success && !toastShownRef.current.has(`link-${address}`)) {
          toastShownRef.current.add(`link-${address}`);
          toast({
            title: "Wallet Linked",
            description: "Your wallet has been successfully linked to your account.",
          });
        }
        return true;
      }
      
      console.log('Checking wallet existence for non-authenticated user...');
      const walletCheckResult = await checkWalletExists(address);
      console.log('Wallet check result:', walletCheckResult);
      
      const { exists, userId } = walletCheckResult;
      
      // Cache the result
      lastResultRef.current = {
        address,
        exists,
        timestamp: Date.now()
      };
      
      if (exists && userId) {
        console.log('✅ EXISTING WALLET DETECTED - Setting up for auto-authentication...');
        setExistingUser(true);
        setNeedsSignup(false);
        
        // Only attempt authentication if not already successful for this wallet
        if (!successfulAuthRef.current.has(address) && !authAttemptRef.current) {
          await attemptAutoAuthentication(address);
        }
        
        return true;
      } else {
        console.log('❌ NEW WALLET DETECTED');
        setNeedsSignup(true);
        setExistingUser(false);
        
        // Show notification for new wallets only once
        const sessionKey = `new_wallet_notified_${address}`;
        if (!sessionStorage.getItem(sessionKey) && !toastShownRef.current.has(`new-${address}`)) {
          sessionStorage.setItem(sessionKey, 'true');
          toastShownRef.current.add(`new-${address}`);
          toast({
            title: "New Wallet Detected", 
            description: "This wallet needs to be linked to an account. Please create an account to continue.",
          });
        }
      }
    } catch (error) {
      console.error('❌ ERROR in wallet check:', error);
      setNeedsSignup(true);
      setExistingUser(false);
      if (!toastShownRef.current.has(`error-${address}`)) {
        toastShownRef.current.add(`error-${address}`);
        toast({
          title: "Wallet Check Failed",
          description: "Unable to verify wallet status. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      processingRef.current = false;
      console.log('=== WALLET AUTH DEBUG END ===');
    }
    
    return false;
  };

  const attemptAutoAuthentication = async (address: string) => {
    // Prevent multiple auth attempts for the same wallet
    if (successfulAuthRef.current.has(address)) {
      console.log('🔄 Authentication already successful for this wallet, skipping');
      return;
    }
    
    if (authAttemptRef.current === address) {
      console.log('🔄 Authentication already in progress for this wallet, skipping');
      return;
    }
    
    authAttemptRef.current = address;
    
    try {
      console.log('🔐 Attempting automatic authentication for wallet:', address);
      
      const authResult = await authenticateByWallet(address);
      
      if (authResult.success) {
        console.log('✅ Automatic authentication successful!');
        
        // Mark as successful to prevent re-attempts
        successfulAuthRef.current.add(address);
        
        // Show success toast only once
        if (!toastShownRef.current.has(`auth-success-${address}`)) {
          toastShownRef.current.add(`auth-success-${address}`);
          toast({
            title: "Welcome Back!",
            description: "Successfully signed in with your wallet.",
          });
        }
        
        // Clear the auth attempt flag
        authAttemptRef.current = '';
        
        // NO PAGE RELOAD - let React handle the state updates naturally
        console.log('🎉 Authentication complete, letting React handle state updates');
        return true;
        
      } else {
        console.warn('⚠️ Automatic authentication failed:', authResult.error);
        authAttemptRef.current = '';
        
        if (!toastShownRef.current.has(`auth-fail-${address}`)) {
          toastShownRef.current.add(`auth-fail-${address}`);
          toast({
            title: "Auto Sign-In Failed",  
            description: "Your wallet is recognized but auto sign-in failed. Please try the manual sign-in button.",
            variant: "destructive",
          });
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Auto authentication error:', error);
      authAttemptRef.current = '';
      
      if (!toastShownRef.current.has(`auth-error-${address}`)) {
        toastShownRef.current.add(`auth-error-${address}`);
        toast({
          title: "Authentication Error",
          description: "Failed to sign in automatically. Please try the manual sign-in button.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  // Reset everything when user authenticates
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('🧹 User authenticated, cleaning up wallet auth state');
      lastProcessedWallet.current = '';
      processingRef.current = false;
      lastResultRef.current = null;
      authAttemptRef.current = '';
      // Don't clear toastShownRef and successfulAuthRef to prevent duplicate notifications
      
      // Clear the signup/existing user flags when authenticated
      setNeedsSignup(false);
      setExistingUser(false);
    }
  }, [isAuthenticated, setNeedsSignup, setExistingUser]);

  return {
    handleWalletConnection,
  };
};
