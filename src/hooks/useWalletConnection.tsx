
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

  // Throttled connection check - respects manual disconnection
  const throttledConnectionCheck = useCallback(async () => {
    const now = Date.now();
    if (now - lastConnectionCheck < 2000) {
      return; // Skip if checked within last 2 seconds
    }
    
    // CRITICAL: Respect manual disconnect - never auto-reconnect after manual disconnect
    const manualDisconnect = localStorage.getItem('manual_wallet_disconnect');
    if (manualDisconnect === 'true') {
      console.log('🚫 Skipping auto-connection check - user manually disconnected');
      return;
    }
    
    setLastConnectionCheck(now);
    
    try {
      const address = await checkIfWalletIsConnected();
      
      if (address && address !== walletAddress && !isWalletConnected) {
        console.log('🔍 Auto-connecting to detected wallet:', address);
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        // Handle wallet authentication
        await handleWalletConnection(address);
      } else if (!address && isWalletConnected) {
        console.log('🔌 Wallet disconnected from extension');
        setIsWalletConnected(false);
        setWalletAddress('');
        setNeedsSignup(false);
        setExistingUser(false);
      }
    } catch (error) {
      console.error('Connection check error:', error);
    }
  }, [checkIfWalletIsConnected, walletAddress, isWalletConnected, lastConnectionCheck, setWalletAddress, setIsWalletConnected, setNeedsSignup, setExistingUser, handleWalletConnection]);

  // Check wallet connection on mount and periodically - but respect manual disconnection
  useEffect(() => {
    // Only do initial connection check on page load if user hasn't manually disconnected
    const manualDisconnect = localStorage.getItem('manual_wallet_disconnect');
    if (manualDisconnect !== 'true') {
      throttledConnectionCheck();
    } else {
      console.log('🚫 Skipping initial connection check - user previously disconnected manually');
    }
    
    // Set up periodic checks (but they will be blocked if manually disconnected)
    const interval = setInterval(throttledConnectionCheck, 5000);
    
    return () => clearInterval(interval);
  }, [throttledConnectionCheck]);

  const connectWallet = useCallback(async (specificWallet?: any) => {
    if (isWalletConnecting) return { success: false, error: 'Already connecting' };
    
    try {
      // Clear manual disconnect flags when user explicitly connects
      console.log('🔗 User manually connecting wallet - clearing disconnect flags');
      localStorage.removeItem('manual_wallet_disconnect');
      localStorage.removeItem('wallet_disconnected');
      
      const address = await connectWalletCore(specificWallet);
      
      if (address) {
        // Handle wallet authentication
        await handleWalletConnection(address);
        
        return {
          success: true,
          address,
          isNewUser: needsSignup,
          message: "Successfully connected wallet"
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
