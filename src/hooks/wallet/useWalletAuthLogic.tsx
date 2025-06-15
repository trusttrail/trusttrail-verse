
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkWalletExists, linkWalletToProfile, handleWalletAutoSignIn } from '@/utils/authUtils';

export const useWalletAuthLogic = (
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const handleWalletConnection = async (address: string) => {
    console.log('=== WALLET AUTH DEBUG START ===');
    console.log('Input address:', address);
    console.log('Address type:', typeof address);
    console.log('Address length:', address?.length);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Current user:', user?.id);
    
    // Reset flags first to ensure clean state
    setNeedsSignup(false);
    setExistingUser(false);
    
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
    
    try {
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
    }
    
    console.log('=== WALLET AUTH DEBUG END ===');
    return false;
  };

  return {
    handleWalletConnection,
  };
};
