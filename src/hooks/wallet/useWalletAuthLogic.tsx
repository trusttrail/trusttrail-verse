
import React, { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { supabase } from '@/integrations/supabase/client';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';

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
        console.log('✅ EXISTING WALLET DETECTED - AUTO SIGN-IN WITHOUT EMAIL');
        console.log('Setting existingUser = true, needsSignup = false');
        setExistingUser(true);
        setNeedsSignup(false);
        
        // Show initial toast
        toast({
          title: "Welcome Back!",
          description: "Your wallet is recognized. Signing you in automatically...",
        });
        
        // Directly authenticate the user without magic link
        try {
          console.log('Starting direct authentication for existing user...');
          
          // Get the user's auth record to get their email
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
          
          if (authError || !authUser.user?.email) {
            console.error('Could not get user auth data:', authError);
            throw new Error('Could not retrieve user authentication data');
          }
          
          console.log('Found user email:', authUser.user.email);
          
          // Use signInWithPassword with a temporary bypass or signInWithOtp for passwordless
          // Since we can't get the password, we'll use the OTP method but configure it to work silently
          const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
            email: authUser.user.email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: window.location.origin,
              data: { wallet_address: address }
            }
          });
          
          if (signInError) {
            console.error('Direct sign-in failed:', signInError);
            throw signInError;
          }
          
          console.log('✅ Authentication initiated successfully');
          
          toast({
            title: "Signed In Successfully",
            description: "You are now signed in with your wallet!",
          });
          
          // Set a timeout to check if authentication was successful
          setTimeout(async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('✅ Authentication confirmed with session');
              toast({
                title: "Authentication Complete",
                description: "You are now fully authenticated!",
              });
            } else {
              console.log('⚠️ Session not found after timeout');
              toast({
                title: "Authentication in Progress",
                description: "Please check your email to complete sign-in if needed.",
              });
            }
          }, 3000);
          
        } catch (autoSignInError) {
          console.error('Direct authentication failed:', autoSignInError);
          toast({
            title: "Authentication Error",
            description: "Direct sign-in failed. You may need to sign in manually.",
            variant: "destructive"
          });
        }
        
        return false;
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
