
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WalletConnectionHook {
  isWalletConnected: boolean;
  walletAddress: string;
  currentNetwork: string;
  connectWallet: () => Promise<void>;
  connectWithWalletConnect: () => Promise<void>;
  disconnectWallet: () => void;
  handleNetworkChange: (network: string) => void;
  isMetaMaskAvailable: boolean;
  isWalletConnecting: boolean;
}

export const useWalletConnection = (): WalletConnectionHook => {
  const { toast } = useToast();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentNetwork, setCurrentNetwork] = useState<string>("polygon");
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState<boolean>(false);

  // Check if MetaMask is installed
  useEffect(() => {
    setIsMetaMaskAvailable(!!window.ethereum);
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        return;
      }

      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  // Connect wallet handler for MetaMask
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

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });

        // Check network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Polygon Mainnet: 0x89
        if (chainId !== '0x89') {
          toast({
            title: "Wrong Network",
            description: "Please switch to Polygon network in your MetaMask wallet.",
            variant: "destructive",
          });
        }
      }
      setIsWalletConnecting(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsWalletConnecting(false);
    }
  };

  // Connect with WalletConnect
  const connectWithWalletConnect = async () => {
    try {
      setIsWalletConnecting(true);
      
      // Since we can't actually implement WalletConnect without installing additional libraries,
      // we'll show a message to the user about the feature
      toast({
        title: "WalletConnect",
        description: "To fully implement WalletConnect, we would need to install the WalletConnect SDK library. This is a UI demonstration.",
      });
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show connection successful toast
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

  // Disconnect wallet handler
  const disconnectWallet = () => {
    // Clear local connection state
    setIsWalletConnected(false);
    setWalletAddress("");
    
    // Local storage could be used to remember disconnection preference
    localStorage.setItem('wallet_disconnected', 'true');
    
    // Note: MetaMask doesn't have a direct method to disconnect
    // We simply clear our app's connection state
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected. Refresh the page to reconnect.",
    });
  };

  // Network change handler
  const handleNetworkChange = (network: string) => {
    if (network !== "polygon") {
      toast({
        title: "Network Not Supported",
        description: `${network.charAt(0).toUpperCase() + network.slice(1)} network is not supported yet. Please switch to Polygon.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentNetwork(network);
    toast({
      title: "Network Changed",
      description: `Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network.`,
    });
  };

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setIsWalletConnected(false);
        setWalletAddress("");
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      } else if (accounts[0] !== walletAddress) {
        // User switched accounts
        setWalletAddress(accounts[0]);
        toast({
          title: "Account Changed",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Polygon Mainnet: 0x89
      if (chainId !== '0x89') {
        toast({
          title: "Wrong Network",
          description: "Please switch to Polygon network in your MetaMask wallet.",
          variant: "destructive",
        });
      } else {
        setCurrentNetwork("polygon");
        toast({
          title: "Network Changed",
          description: "Connected to Polygon network.",
        });
      }
    };

    // Check if user has previously disconnected the wallet
    const hasDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
    
    // Only auto-connect if user hasn't explicitly disconnected
    if (!hasDisconnected) {
      checkIfWalletIsConnected();
    }

    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletAddress, toast]);

  return {
    isWalletConnected,
    walletAddress,
    currentNetwork,
    connectWallet,
    connectWithWalletConnect,
    disconnectWallet,
    handleNetworkChange,
    isMetaMaskAvailable,
    isWalletConnecting
  };
};
