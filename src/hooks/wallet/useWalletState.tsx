import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  const { isAuthenticated } = useAuth();
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

  // Clear wallet states when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setNeedsSignup(false);
      setExistingUser(false);
      // Keep wallet connection state - don't auto-disconnect
    }
  }, [isAuthenticated]);

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setNeedsSignup(false);
    setExistingUser(false);
    
    localStorage.setItem('wallet_disconnected', 'true');
    localStorage.removeItem('connected_wallet_address');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
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
    isWalletConnected,
    walletAddress,
    currentNetwork,
    isMetaMaskAvailable,
    isWalletConnecting,
    needsSignup,
    existingUser,
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setIsWalletConnecting,
    setNeedsSignup,
    setExistingUser,
    disconnectWallet,
    handleNetworkChange,
  };
};
