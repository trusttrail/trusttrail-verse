
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
    console.log('Handling wallet connection for:', address, 'Authenticated:', isAuthenticated);
    
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
    console.log('Checking wallet existence for non-authenticated user:', address);
    const { exists, userId } = await checkWalletExists(address);
    console.log('Wallet exists check result:', { exists, userId, address });
    
    if (exists && userId) {
      console.log('Existing wallet detected - attempting auto sign-in');
      setExistingUser(true);
      setNeedsSignup(false);
      
      toast({
        title: "Welcome Back!",
        description: "Your wallet is recognized. Signing you in automatically...",
      });
      
      // Attempt auto sign-in for existing wallet
      const autoSignInResult = await handleWalletAutoSignIn(address);
      if (autoSignInResult.success) {
        console.log('Auto sign-in successful');
        return true;
      } else {
        console.log('Auto sign-in failed, user needs to sign in manually');
        toast({
          title: "Sign In Required",
          description: "Please complete sign-in to continue.",
        });
      }
      
      return false;
    } else {
      // New wallet - needs signup
      console.log('New wallet detected - setting needs signup flag');
      setNeedsSignup(true);
      setExistingUser(false);
      toast({
        title: "New Wallet Detected", 
        description: "This wallet needs to be linked to an account. Please create an account to continue.",
      });
    }
    
    return false;
  };

  return {
    handleWalletConnection,
  };
};
