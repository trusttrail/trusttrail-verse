
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WalletConnectionHook {
  isWalletConnected: boolean;
  walletAddress: string;
  currentNetwork: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  handleNetworkChange: (network: string) => void;
}

export const useWalletConnection = (): WalletConnectionHook => {
  const { toast } = useToast();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentNetwork, setCurrentNetwork] = useState<string>("polygon");

  // Check if MetaMask is installed
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension to connect your wallet.",
          variant: "destructive",
        });
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

  // Connect wallet handler
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension to connect your wallet.",
          variant: "destructive",
        });
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
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Disconnect wallet handler
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
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

    // Check if wallet is connected when component mounts
    checkIfWalletIsConnected();

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
    disconnectWallet,
    handleNetworkChange
  };
};
