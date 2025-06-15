
import { useToast } from '@/hooks/use-toast';
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME } from "@/constants/network";
import { checkWalletExists } from '@/utils/authUtils';

export const useWalletConnection = (
  setIsWalletConnected: (val: boolean) => void,
  setWalletAddress: (val: string) => void,
  setCurrentNetwork: (val: string) => void,
  setIsWalletConnecting: (val: boolean) => void
) => {
  const { toast } = useToast();

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return null;

      console.log('Checking if wallet is connected...');
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const address = accounts[0];
        console.log('Found connected wallet:', address);
        setWalletAddress(address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);

        if (chainId === AMOY_CHAIN_ID) {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          localStorage.setItem('connected_wallet_address', address);
          
          // Return the address so wallet auth logic can check if it's new/existing
          return address;
        } else {
          console.log('Wrong network detected');
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
        }
      } else {
        console.log('No wallet accounts found');
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
    return null;
  };

  const connectWallet = async () => {
    try {
      setIsWalletConnecting(true);
      console.log('Attempting to connect wallet...');
      
      if (!window.ethereum) {
        toast({
          title: "No Wallet Detected",
          description: "No MetaMask or compatible wallet extension found.",
          variant: "destructive",
        });
        setIsWalletConnecting(false);
        return null;
      }

      localStorage.removeItem('wallet_disconnected');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Wallet connection accounts:', accounts);

      if (accounts.length > 0) {
        const address = accounts[0];
        console.log('Connected wallet address:', address);
        setWalletAddress(address);
        localStorage.setItem('connected_wallet_address', address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Connected wallet chain ID:', chainId);

        if (chainId !== AMOY_CHAIN_ID) {
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
          toast({
            title: "Wrong Network",
            description: `Please switch to ${AMOY_NETWORK_NAME} in your MetaMask wallet to connect.`,
            variant: "destructive",
          });
          return null;
        } else {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          });
          
          // Return the address so wallet auth logic can determine if it's new/existing
          return address;
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
    return null;
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
