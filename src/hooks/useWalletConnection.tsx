
import { useWalletState } from './wallet/useWalletState';
import { useWalletAuth } from './wallet/useWalletAuth';
import { useWalletEvents } from './wallet/useWalletEvents';
import { useWalletNetwork } from "./wallet/useWalletNetwork";

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
  needsSignup: boolean;
  existingUser: boolean;
}

export const useWalletConnection = (): WalletConnectionHook => {
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
    connectWallet,
    connectWithWalletConnect,
  } = useWalletAuth(
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setIsWalletConnecting,
    setNeedsSignup,
    setExistingUser
  );

  // Set up wallet events
  useWalletEvents(
    walletAddress,
    isWalletConnected,
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setNeedsSignup,
    setExistingUser,
    checkIfWalletIsConnected
  );

  // Use extracted network effect
  useWalletNetwork(
    walletAddress,
    setIsWalletConnected,
    setCurrentNetwork,
    { toast: () => {} }, // This will be replaced by the actual toast from useWalletNetwork
    setWalletAddress
  );

  return {
    isWalletConnected,
    walletAddress,
    currentNetwork,
    connectWallet,
    connectWithWalletConnect,
    disconnectWallet,
    handleNetworkChange,
    isMetaMaskAvailable,
    isWalletConnecting,
    needsSignup,
    existingUser
  };
};
