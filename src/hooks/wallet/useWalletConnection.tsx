
import { useToast } from '@/hooks/use-toast';
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME, ETH_SEPOLIA_CHAIN_ID, ETH_SEPOLIA_NETWORK_NAME, OP_SEPOLIA_CHAIN_ID, OP_SEPOLIA_NETWORK_NAME } from "@/constants/network";
import { detectWallets, getPrimaryWallet, connectToWallet, checkWalletConnection, DetectedWallet } from '@/utils/walletProviders';

export const useWalletConnection = (
  setIsWalletConnected: (val: boolean) => void,
  setWalletAddress: (val: string) => void,
  setCurrentNetwork: (val: string) => void,
  setIsWalletConnecting: (val: boolean) => void
) => {
  const { toast } = useToast();

  const checkIfWalletIsConnected = async (): Promise<string | null> => {
    try {
      console.log('=== CHECK MULTI-WALLET CONNECTION DEBUG ===');
      console.log('Detecting available wallets...');
      
      const connectionStatus = await checkWalletConnection();
      
      if (!connectionStatus.isConnected || !connectionStatus.address) {
        console.log('No wallet connected');
        return null;
      }

      console.log('Found connected wallet:', {
        address: connectionStatus.address,
        wallet: connectionStatus.wallet?.provider.name
      });

      const accounts = [connectionStatus.address];
      console.log('Found accounts:', accounts);

      if (accounts.length > 0) {
        const address = accounts[0];
        console.log('Found connected wallet:', address);
        console.log('Setting wallet address:', address);
        setWalletAddress(address);

        const chainId = await connectionStatus.wallet?.instance.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        console.log('Supported chain IDs:', AMOY_CHAIN_ID, ETH_SEPOLIA_CHAIN_ID, OP_SEPOLIA_CHAIN_ID);

        if (chainId === AMOY_CHAIN_ID) {
          console.log('✅ Polygon Amoy network detected');
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          localStorage.setItem('connected_wallet_address', address);
          
          console.log('Returning address for auth check:', address);
          return address;
        } else if (chainId === ETH_SEPOLIA_CHAIN_ID) {
          console.log('✅ Ethereum Sepolia network detected');
          setIsWalletConnected(true);
          setCurrentNetwork("ethSepolia");
          localStorage.setItem('connected_wallet_address', address);
          
          console.log('Returning address for auth check:', address);
          return address;
        } else if (chainId === OP_SEPOLIA_CHAIN_ID) {
          console.log('✅ OP Sepolia network detected');
          setIsWalletConnected(true);
          setCurrentNetwork("opSepolia");
          localStorage.setItem('connected_wallet_address', address);
          
          console.log('Returning address for auth check:', address);
          return address;
        } else {
          console.log('❌ Unsupported network detected');
          setIsWalletConnected(false);
          setCurrentNetwork("unsupported");
        }
      } else {
        console.log('No wallet accounts found');
      }
    } catch (error) {
      console.error("❌ Error checking if wallet is connected:", error);
    }
    return null;
  };

  const connectWallet = async (specificWallet?: DetectedWallet): Promise<string | null> => {
    try {
      setIsWalletConnecting(true);
      console.log('=== CONNECT MULTI-WALLET DEBUG ===');
      console.log('Attempting to connect wallet...');
      
      // Get available wallets
      const availableWallets = detectWallets();
      console.log('Available wallets:', availableWallets.map(w => w.provider.name));
      
      if (availableWallets.length === 0) {
        console.log('❌ No compatible wallets detected');
        toast({
          title: "No Wallet Detected",
          description: "No compatible wallet extensions found. Please install MetaMask, Rainbow, Trust Wallet, or another compatible wallet.",
          variant: "destructive",
        });
        setIsWalletConnecting(false);
        return null;
      }

      // Use specified wallet or primary wallet
      const walletToConnect = specificWallet || getPrimaryWallet();
      
      if (!walletToConnect) {
        console.log('❌ No wallet available for connection');
        setIsWalletConnecting(false);
        return null;
      }

      console.log('Connecting to:', walletToConnect.provider.name);
      localStorage.removeItem('wallet_disconnected');

      const accounts = await connectToWallet(walletToConnect);
      console.log('Wallet connection accounts:', accounts);

      if (accounts.length > 0) {
        const address = accounts[0];
        console.log('Connected wallet address:', address);
        setWalletAddress(address);
        localStorage.setItem('connected_wallet_address', address);

        const chainId = await walletToConnect.instance.request({ method: 'eth_chainId' });
        console.log('Connected wallet chain ID:', chainId);

        if (chainId !== AMOY_CHAIN_ID && chainId !== ETH_SEPOLIA_CHAIN_ID && chainId !== OP_SEPOLIA_CHAIN_ID) {
          console.log('❌ Unsupported network after connection');
          setIsWalletConnected(false);
          setCurrentNetwork("unsupported");
          toast({
            title: "Unsupported Network",
            description: `Please switch to ${AMOY_NETWORK_NAME}, ${ETH_SEPOLIA_NETWORK_NAME}, or ${OP_SEPOLIA_NETWORK_NAME} to continue.`,
            variant: "destructive",
          });
          return null;
        } else {
          let networkName: string;
          let displayName: string;
          
          if (chainId === AMOY_CHAIN_ID) {
            networkName = "amoy";
            displayName = AMOY_NETWORK_NAME;
          } else if (chainId === ETH_SEPOLIA_CHAIN_ID) {
            networkName = "ethSepolia";
            displayName = ETH_SEPOLIA_NETWORK_NAME;
          } else {
            networkName = "opSepolia";
            displayName = OP_SEPOLIA_NETWORK_NAME;
          }
          
          console.log(`✅ Supported network detected: ${displayName}`);
          setIsWalletConnected(true);
          setCurrentNetwork(networkName);
          
          toast({
            title: "Wallet Connected",
            description: `Connected ${walletToConnect.provider.name} to ${displayName} with ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          });
          
          // Return the address so wallet auth logic can determine if it's new/existing
          console.log('Returning connected address for auth check:', address);
          return address;
        }
      }
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
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
    getAvailableWallets: () => detectWallets(),
    getPrimaryWallet,
  };
};
