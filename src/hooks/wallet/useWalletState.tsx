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
    console.log('🔌 Executing manual wallet disconnect...');
    
    setIsWalletConnected(false);
    setWalletAddress("");
    setNeedsSignup(false);
    setExistingUser(false);
    
    // Set a persistent flag to prevent auto-reconnection
    localStorage.setItem('manual_wallet_disconnect', 'true');
    localStorage.setItem('wallet_disconnected', 'true');
    localStorage.removeItem('connected_wallet_address');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected. Click 'Connect Wallet' to reconnect.",
    });
    
    console.log('✅ Manual wallet disconnect completed - auto-reconnection disabled');
  };

  const handleNetworkChange = (network: string) => {
    if (!["amoy", "ethSepolia", "opSepolia"].includes(network)) {
      toast({
        title: "Network Not Supported",
        description: `Only Polygon & Optimism testnets are supported.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentNetwork(network);
    const networkName = network === "amoy" ? "Polygon Amoy" : "OP Sepolia";
    toast({
      title: "Network Changed",
      description: `Switched to ${networkName} testnet.`,
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
