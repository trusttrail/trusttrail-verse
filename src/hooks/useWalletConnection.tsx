
import { useState, useEffect, useCallback } from 'react';
import { useWalletState } from '@/hooks/wallet/useWalletState';
import { useWalletConnection as useWalletConnectionCore } from '@/hooks/wallet/useWalletConnection';
import { useWalletAuthLogic } from '@/hooks/wallet/useWalletAuthLogic';
import { useToast } from '@/hooks/use-toast';

export const useWalletConnection = () => {
  const {
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
  } = useWalletState();

  const {
    checkIfWalletIsConnected,
    connectWallet: connectWalletCore,
    connectWithWalletConnect: connectWithWalletConnectCore,
  } = useWalletConnectionCore(
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setIsWalletConnecting
  );

  const { handleWalletConnection } = useWalletAuthLogic(setNeedsSignup, setExistingUser);
  const { toast } = useToast();

  const [lastConnectionCheck, setLastConnectionCheck] = useState<number>(0);

  // Throttled connection check - only check every 2 seconds
  const throttledConnectionCheck = useCallback(async () => {
    const now = Date.now();
    if (now - lastConnectionCheck < 2000) {
      return; // Skip if checked within last 2 seconds
    }
    
    setLastConnectionCheck(now);
    
    try {
      const address = await checkIfWalletIsConnected();
      
      if (address && address !== walletAddress) {
        console.log('🔍 New wallet address detected:', address);
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        // Handle wallet authentication
        await handleWalletConnection(address);
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
  }, [checkIfWalletIsConnected, walletAddress, isWalletConnected, lastConnectionCheck, setWalletAddress, setIsWalletConnected, setNeedsSignup, setExistingUser, handleWalletConnection]);

  // Check wallet connection on mount and periodically
  useEffect(() => {
    throttledConnectionCheck();
    
    // Check every 5 seconds instead of constantly
    const interval = setInterval(throttledConnectionCheck, 5000);
    
    return () => clearInterval(interval);
  }, [throttledConnectionCheck]);

  const connectWallet = useCallback(async () => {
    if (isWalletConnecting) return { success: false, error: 'Already connecting' };
    
    try {
      const address = await connectWalletCore();
      
      if (address) {
        // Handle wallet authentication
        await handleWalletConnection(address);
        
        return {
          success: true,
          address,
          isNewUser: needsSignup,
          message: "Successfully connected to MetaMask"
        };
      } else {
        return {
          success: false,
          error: "Failed to connect wallet"
        };
      }
    } catch (error) {
      console.error('Connect wallet error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection failed"
      };
    }
  }, [connectWalletCore, isWalletConnecting, needsSignup, handleWalletConnection]);

  const connectWithWalletConnect = useCallback(async () => {
    return await connectWithWalletConnectCore();
  }, [connectWithWalletConnectCore]);

  return {
    isWalletConnected,
    walletAddress,
    needsSignup,
    existingUser,
    isConnecting: isWalletConnecting,
    connectWallet,
    currentNetwork,
    connectWithWalletConnect,
    disconnectWallet,
    handleNetworkChange,
    isMetaMaskAvailable,
    isWalletConnecting
  };
};
