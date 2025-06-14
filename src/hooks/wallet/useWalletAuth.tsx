
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
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

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        // Accept Amoy testnet as valid
        if (chainId === AMOY_CHAIN_ID) {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          localStorage.setItem('connected_wallet_address', address);

          // Only check database if user is NOT authenticated
          if (!isAuthenticated) {
            const { exists } = await checkWalletExists(address);
            
            if (exists) {
              setExistingUser(true);
              setNeedsSignup(false);
              toast({
                title: "Wallet Connected - Account Found",
                description: "Please sign in to continue with your existing account.",
              });
            } else {
              setNeedsSignup(true);
              setExistingUser(false);
              toast({
                title: "Wallet Connected - New Wallet",
                description: "Please create an account to link this wallet.",
              });
            }
          } else if (isAuthenticated && user) {
            // Link wallet to current user if already authenticated
            await linkWalletToProfile(user.id, address);
            toast({
              title: "Wallet Connected",
              description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
          } else {
            // Just connected, no auth state determined yet
            toast({
              title: "Wallet Connected",
              description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
          }
        } else {
          // Auto-disconnect if on wrong network
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
          toast({
            title: "Wrong Network",
            description: `Please switch to ${AMOY_NETWORK_NAME} in your MetaMask wallet to connect.`,
            variant: "destructive",
          });
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

      // Clear any previous disconnect flag
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
          
          // Only check database if user is NOT authenticated
          if (!isAuthenticated) {
            const { exists } = await checkWalletExists(address);
            
            if (exists) {
              setExistingUser(true);
              setNeedsSignup(false);
              toast({
                title: "Wallet Connected - Account Found",
                description: "Please sign in to continue with your existing account.",
              });
            } else {
              setNeedsSignup(true);
              setExistingUser(false);
              toast({
                title: "Wallet Connected - New Wallet",
                description: "Please create an account to link this wallet and start writing reviews.",
              });
            }
          } else if (isAuthenticated && user) {
            // Link wallet to current user
            const linkResult = await linkWalletToProfile(user.id, address);
            if (linkResult.success) {
              setNeedsSignup(false);
              setExistingUser(false);
              toast({
                title: "Wallet Linked",
                description: `Wallet connected and linked to your account!`,
              });
            }
          } else {
            // Just connected, show success
            toast({
              title: "Wallet Connected",
              description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
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
