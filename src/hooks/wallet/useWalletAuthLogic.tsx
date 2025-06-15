
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
      console.log('User already authenticated, linking wallet to profile');
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
    console.log('Wallet exists check:', { exists, userId, address });
    
    if (exists && userId) {
      console.log('Existing wallet detected - setting existing user flag');
      
      // Clear any previous state flags
      setNeedsSignup(false);
      setExistingUser(true);
      
      toast({
        title: "Welcome Back!",
        description: "Your wallet is recognized. Please sign in to continue.",
      });
      
      return false; // Don't auto-sign in, let user manually sign in
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
