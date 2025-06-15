
import React, { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { checkWalletExists, linkWalletToProfile, handleWalletAutoSignIn } from '@/utils/authUtils';

export const useWalletAuthLogic = (
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { clearNotifications } = useRecentActivity();
  const lastProcessedWallet = useRef<string>('');
  const processingRef = useRef<boolean>(false);
  // Temporarily disable caching to debug the issue
  const lastResultRef = useRef<{ address: string; exists: boolean; timestamp: number } | null>(null);

  const handleWalletConnection = async (address: string) => {
    console.log('=== WALLET AUTH DEBUG START ===');
    console.log('Input address:', address);
    console.log('Last processed wallet:', lastProcessedWallet.current);
    console.log('Currently processing:', processingRef.current);
    
    // TEMPORARILY DISABLE CACHING TO DEBUG THE ISSUE
    console.log('🚨 CACHING DISABLED FOR DEBUGGING - FORCING FRESH WALLET CHECK');
    
    // Prevent concurrent processing only
    if (processingRef.current) {
      console.log('⚠️ Skipping concurrent wallet auth for:', address);
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
      
      // ALWAYS check if wallet exists for non-authenticated users
      console.log('Checking wallet existence for non-authenticated user...');
      console.log('Calling checkWalletExists with address:', address);
      
      const walletCheckResult = await checkWalletExists(address);
      console.log('Raw wallet check result:', walletCheckResult);
      console.log('Exists:', walletCheckResult.exists);
      console.log('User ID:', walletCheckResult.userId);
      
      const { exists, userId } = walletCheckResult;
      
      if (exists && userId) {
        console.log('✅ EXISTING WALLET DETECTED');
        console.log('Setting existingUser = true, needsSignup = false');
        setExistingUser(true);
        setNeedsSignup(false);
        
        toast({
          title: "Welcome Back!",
          description: "Your wallet is recognized. Signing you in automatically...",
        });
        
        // Attempt auto sign-in for existing wallet
        console.log('Attempting auto sign-in...');
        const autoSignInResult = await handleWalletAutoSignIn(address);
        console.log('Auto sign-in result:', autoSignInResult);
        
        if (autoSignInResult.success) {
          console.log('✅ Auto sign-in successful');
          return true;
        } else {
          console.log('❌ Auto sign-in failed, user needs to sign in manually');
          toast({
            title: "Sign In Required",
            description: "Please complete sign-in to continue.",
          });
        }
        
        return false;
      } else {
        // New wallet - needs signup
        console.log('❌ NEW WALLET DETECTED');
        console.log('Setting needsSignup = true, existingUser = false');
        setNeedsSignup(true);
        setExistingUser(false);
        toast({
          title: "New Wallet Detected", 
          description: "This wallet needs to be linked to an account. Please create an account to continue.",
        });
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

  // Reset the last processed wallet when user authenticates
  React.useEffect(() => {
    if (isAuthenticated) {
      lastProcessedWallet.current = '';
      processingRef.current = false;
      lastResultRef.current = null;
    }
  }, [isAuthenticated]);

  return {
    handleWalletConnection,
  };
};
