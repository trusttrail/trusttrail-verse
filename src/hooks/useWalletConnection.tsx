
import { useState, useEffect, useCallback } from 'react';
import { useWalletAuth } from '@/hooks/wallet/useWalletAuth';
import { useToast } from '@/hooks/use-toast';

export const useWalletConnection = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [needsSignup, setNeedsSignup] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<number>(0);

  const { checkWalletConnection, connectWallet: connectWalletAuth } = useWalletAuth();
  const { toast } = useToast();

  // Throttled connection check - only check every 2 seconds
  const throttledConnectionCheck = useCallback(async () => {
    const now = Date.now();
    if (now - lastConnectionCheck < 2000) {
      return; // Skip if checked within last 2 seconds
    }
    
    setLastConnectionCheck(now);
    
    try {
      const address = await checkWalletConnection();
      
      if (address && address !== walletAddress) {
        console.log('🔍 New wallet address detected:', address);
        setWalletAddress(address);
        setIsWalletConnected(true);
      } else if (!address && isWalletConnected) {
        console.log('🔌 Wallet disconnected');
        setIsWalletConnected(false);
        setWalletAddress('');
        setNeedsSignup(false);
        setExistingUser(false);
      }
    } catch (error) {
      console.error('Connection check error:', error);
    }
  }, [checkWalletConnection, walletAddress, isWalletConnected, lastConnectionCheck]);

  // Check wallet connection on mount and periodically
  useEffect(() => {
    throttledConnectionCheck();
    
    // Check every 5 seconds instead of constantly
    const interval = setInterval(throttledConnectionCheck, 5000);
    
    return () => clearInterval(interval);
  }, [throttledConnectionCheck]);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      const result = await connectWalletAuth();
      
      if (result.success) {
        setIsWalletConnected(true);
        setWalletAddress(result.address || '');
        setNeedsSignup(result.isNewUser || false);
        setExistingUser(!result.isNewUser || false);
        
        toast({
          title: "Wallet Connected! 🎉",
          description: result.message || "Successfully connected to MetaMask",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.error || "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [connectWalletAuth, isConnecting, toast]);

  return {
    isWalletConnected,
    walletAddress,
    needsSignup,
    existingUser,
    isConnecting,
    connectWallet
  };
};
