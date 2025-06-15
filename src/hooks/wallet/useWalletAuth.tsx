
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME } from "@/constants/network";
import { supabase } from "@/integrations/supabase/client";

export const useWalletAuth = (
  setIsWalletConnected: (val: boolean) => void,
  setWalletAddress: (val: string) => void,
  setCurrentNetwork: (val: string) => void,
  setIsWalletConnecting: (val: boolean) => void,
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const handleWalletConnection = async (address: string) => {
    // Check if wallet exists in database
    const { exists, userId } = await checkWalletExists(address);
    
    if (exists && userId && !isAuthenticated) {
      // Auto sign-in user with existing wallet
      try {
        // Get the user's profile to find their email
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', address)
          .single();
        
        if (!error && profile) {
          // Get user details from auth.users (we need their email for auto sign-in)
          const { data: authData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
          
          if (!userError && authData?.user?.email) {
            // Create a magic link for automatic sign-in
            const { error: magicLinkError } = await supabase.auth.signInWithOtp({
              email: authData.user.email,
              options: {
                shouldCreateUser: false,
                emailRedirectTo: `${window.location.origin}/`
              }
            });

            if (!magicLinkError) {
              toast({
                title: "Wallet Recognized - Auto Sign In",
                description: `Automatically signing you in with ${authData.user.email}...`,
              });
              
              // Clear the signup/existing user flags since we're auto-signing in
              setNeedsSignup(false);
              setExistingUser(false);
              
              return true; // Auto sign-in initiated
            }
          }
        }
      } catch (error) {
        console.error('Error during auto sign-in:', error);
        // Fall back to normal flow
      }
    }
    
    if (exists && !isAuthenticated) {
      setExistingUser(true);
      setNeedsSignup(false);
      toast({
        title: "Wallet Recognized",
        description: "This wallet is linked to an existing account. Please sign in to continue.",
      });
    } else if (!exists && !isAuthenticated) {
      setNeedsSignup(true);
      setExistingUser(false);
      toast({
        title: "New Wallet Detected", 
        description: "This wallet needs to be linked to an account. Please create an account to continue.",
      });
    } else if (isAuthenticated && user) {
      // Link wallet to current user
      const linkResult = await linkWalletToProfile(user.id, address);
      if (linkResult.success) {
        setNeedsSignup(false);
        setExistingUser(false);
        toast({
          title: "Wallet Linked",
          description: "Your wallet has been successfully linked to your account.",
        });
      }
    }
    
    return false; // No auto sign-in occurred
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId === AMOY_CHAIN_ID) {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          localStorage.setItem('connected_wallet_address', address);

          // Only check database and show notifications if user is NOT authenticated
          if (!isAuthenticated) {
            await handleWalletConnection(address);
          } else if (isAuthenticated && user) {
            // Silently link wallet to current user if already authenticated
            await linkWalletToProfile(user.id, address);
          }
        } else {
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
        }
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsWalletConnecting(true);
      
      if (!window.ethereum) {
        toast({
          title: "No Wallet Detected",
          description: "No MetaMask or compatible wallet extension found.",
          variant: "destructive",
        });
        setIsWalletConnecting(false);
        return;
      }

      localStorage.removeItem('wallet_disconnected');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem('connected_wallet_address', address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== AMOY_CHAIN_ID) {
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
          toast({
            title: "Wrong Network",
            description: `Please switch to ${AMOY_NETWORK_NAME} in your MetaMask wallet to connect.`,
            variant: "destructive",
          });
        } else {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          
          // Show success notification only once
          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          });
          
          // Only check database if user is NOT authenticated
          if (!isAuthenticated) {
            const wasAutoSignedIn = await handleWalletConnection(address);
            // If auto sign-in didn't occur, messages are already shown in handleWalletConnection
          } else if (isAuthenticated && user) {
            // Link wallet to current user
            const linkResult = await linkWalletToProfile(user.id, address);
            if (linkResult.success) {
              setNeedsSignup(false);
              setExistingUser(false);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const connectWithWalletConnect = async () => {
    try {
      setIsWalletConnecting(true);
      
      toast({
        title: "WalletConnect",
        description: "To fully implement WalletConnect, we would need to install the WalletConnect SDK library. This is a UI demonstration.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "WalletConnect Ready",
        description: "Scan a QR code with your mobile wallet to connect.",
      });
      
      setIsWalletConnecting(false);
    } catch (error) {
      console.error("Error connecting with WalletConnect:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to initialize WalletConnect. Please try again.",
        variant: "destructive",
      });
      setIsWalletConnecting(false);
    }
  };

  return {
    checkIfWalletIsConnected,
    connectWallet,
    connectWithWalletConnect,
  };
};
