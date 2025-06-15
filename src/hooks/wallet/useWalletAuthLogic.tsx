
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
    
    // If user is already authenticated, just link the wallet
    if (isAuthenticated && user) {
      const linkResult = await linkWalletToProfile(user.id, address);
      if (linkResult.success) {
        setNeedsSignup(false);
        setExistingUser(false);
        toast({
          title: "Wallet Linked",
          description: "Your wallet has been successfully linked to your account.",
        });
      }
      return true;
    }
    
    // Check if wallet exists for non-authenticated users
    const { exists, userId } = await checkWalletExists(address);
    
    if (exists && userId) {
      console.log('Existing wallet detected - initiating auto sign-in');
      
      // Clear any previous state flags
      setExistingUser(false);
      setNeedsSignup(false);
      
      toast({
        title: "Welcome Back!",
        description: "Your wallet is recognized. Signing you in automatically...",
      });
      
      // Initiate auto sign-in process
      const result = await handleWalletAutoSignIn(address);
      if (result.success) {
        return true; // Wallet was recognized and auto sign-in initiated
      }
    } else {
      // New wallet - needs signup
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
