
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WalletState {
  isWalletConnected: boolean;
  walletAddress: string;
  currentNetwork: string;
  isMetaMaskAvailable: boolean;
  isWalletConnecting: boolean;
  needsSignup: boolean;
  existingUser: boolean;
}

export const useWalletState = () => {
  const { toast } = useToast();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentNetwork, setCurrentNetwork] = useState<string>("amoy");
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState<boolean>(false);
  const [needsSignup, setNeedsSignup] = useState<boolean>(false);
  const [existingUser, setExistingUser] = useState<boolean>(false);

  // Check if MetaMask is installed
  useEffect(() => {
    setIsMetaMaskAvailable(!!window.ethereum);
  }, []);

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setNeedsSignup(false);
    setExistingUser(false);
    
    localStorage.setItem('wallet_disconnected', 'true');
    localStorage.removeItem('connected_wallet_address');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected. Refresh the page to reconnect.",
    });
  };

  const handleNetworkChange = (network: string) => {
    if (network !== "amoy") {
      toast({
        title: "Network Not Supported",
        description: `Currently only Polygon Amoy testnet is supported in the testnet dApp.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentNetwork("amoy");
    toast({
      title: "Network Changed",
      description: `Switched to Polygon Amoy testnet.`,
    });
  };

  return {
    // State
    isWalletConnected,
    walletAddress,
    currentNetwork,
    isMetaMaskAvailable,
    isWalletConnecting,
    needsSignup,
    existingUser,
    // Setters
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setIsWalletConnecting,
    setNeedsSignup,
    setExistingUser,
    // Actions
    disconnectWallet,
    handleNetworkChange,
  };
};
