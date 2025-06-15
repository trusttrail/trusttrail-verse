
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
  const authAttemptRef = useRef<string>(''); // Track last auth attempt to prevent spam

  const handleWalletConnection = async (address: string) => {
    console.log('=== WALLET AUTH DEBUG START ===');
    console.log('Input address:', address);
    console.log('Last processed wallet:', lastProcessedWallet.current);
    console.log('Currently processing:', processingRef.current);
    
    // Check if we have a recent result for this address (within 30 seconds)
    const now = Date.now();
    if (lastResultRef.current && 
        lastResultRef.current.address === address && 
        (now - lastResultRef.current.timestamp) < 30000) {
      console.log('⚠️ Using cached result for wallet:', address);
      const cached = lastResultRef.current;
      if (cached.exists) {
        setExistingUser(true);
        setNeedsSignup(false);
        // Only attempt auth if we haven't tried for this address recently
        if (authAttemptRef.current !== address) {
          await attemptAutoAuthentication(address);
        }
      } else {
        setNeedsSignup(true);
        setExistingUser(false);
      }
      return false;
    }
    
    // Prevent duplicate processing for the same wallet or concurrent processing
    if (lastProcessedWallet.current === address || processingRef.current) {
      console.log('⚠️ Skipping duplicate/concurrent wallet auth for:', address);
      return false;
    }
    
    // Set processing flag to prevent concurrent execution
    processingRef.current = true;
    lastProcessedWallet.current = address;
    
    console.log('Processing wallet auth for:', address);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Current user:', user?.id);
    
    // Clear all notifications immediately when wallet connects
    clearNotifications();
    
    // Reset flags first to ensure clean state
    setNeedsSignup(false);
    setExistingUser(false);
    
    try {
      // If user is already authenticated, just link the wallet
      if (isAuthenticated && user) {
        console.log('User already authenticated, linking wallet to profile');
        const linkResult = await linkWalletToProfile(user.id, address);
        if (linkResult.success) {
          toast({
            title: "Wallet Linked",
            description: "Your wallet has been successfully linked to your account.",
          });
        }
        return true;
      }
      
      // Check if wallet exists for non-authenticated users
      console.log('Checking wallet existence for non-authenticated user...');
      console.log('Calling checkWalletExists with address:', address);
      
      const walletCheckResult = await checkWalletExists(address);
      console.log('Raw wallet check result:', walletCheckResult);
      console.log('Exists:', walletCheckResult.exists);
      console.log('User ID:', walletCheckResult.userId);
      
      const { exists, userId } = walletCheckResult;
      
      // Cache the result
      lastResultRef.current = {
        address,
        exists,
        timestamp: now
      };
      
      if (exists && userId) {
        console.log('✅ EXISTING WALLET DETECTED');
        console.log('Setting existingUser = true, needsSignup = false');
        setExistingUser(true);
        setNeedsSignup(false);
        
        // Automatically authenticate existing users - only if we haven't tried for this address
        if (authAttemptRef.current !== address) {
          console.log('🔐 Automatically authenticating existing user...');
          await attemptAutoAuthentication(address);
        }
        
        console.log('✅ Existing user processing complete');
        return true;
      } else {
        // New wallet - needs signup
        console.log('❌ NEW WALLET DETECTED');
        console.log('Setting needsSignup = true, existingUser = false');
        setNeedsSignup(true);
        setExistingUser(false);
        
        // Only show toast notification once per session for new wallets
        const sessionKey = `new_wallet_notified_${address}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, 'true');
          toast({
            title: "New Wallet Detected", 
            description: "This wallet needs to be linked to an account. Please create an account to continue.",
          });
        }
      }
    } catch (error) {
      console.error('❌ ERROR in wallet check:', error);
      // On error, default to new wallet behavior
      setNeedsSignup(true);
      setExistingUser(false);
      toast({
        title: "Wallet Check Failed",
        description: "Unable to verify wallet status. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Always clear processing flag
      processingRef.current = false;
      console.log('=== WALLET AUTH DEBUG END ===');
    }
    
    return false;
  };

  const attemptAutoAuthentication = async (address: string) => {
    // Mark this address as having an auth attempt to prevent spam
    authAttemptRef.current = address;
    
    try {
      console.log('🔐 Attempting automatic authentication for wallet:', address);
      
      const authResult = await authenticateByWallet(address);
      
      if (authResult.success) {
        console.log('✅ Automatic authentication successful!');
        toast({
          title: "Welcome Back!",
          description: "Successfully signed in with your wallet.",
        });
        
        // Force page reload to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.warn('⚠️ Automatic authentication failed:', authResult.error);
        // Clear the attempt ref so they can try manual sign-in
        authAttemptRef.current = '';
        toast({
          title: "Auto Sign-In Failed",  
          description: "Your wallet is recognized but auto sign-in failed. Please try the manual sign-in button.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Auto authentication error:', error);
      // Clear the attempt ref so they can try manual sign-in
      authAttemptRef.current = '';
      toast({
        title: "Authentication Error",
        description: "Failed to sign in automatically. Please try the manual sign-in button.",
        variant: "destructive",
      });
    }
  };

  // Reset the last processed wallet when user authenticates
  React.useEffect(() => {
    if (isAuthenticated) {
      lastProcessedWallet.current = '';
      processingRef.current = false;
      lastResultRef.current = null;
      authAttemptRef.current = '';
    }
  }, [isAuthenticated]);

  return {
    handleWalletConnection,
  };
};
