import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkWalletExists, linkWalletToProfile, handleWalletAutoSignIn } from '@/utils/authUtils';
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME } from "@/constants/network";

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

          // Handle wallet connection logic
          await handleWalletConnection(address);
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
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          });
          
          // Handle wallet connection logic
          await handleWalletConnection(address);
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
