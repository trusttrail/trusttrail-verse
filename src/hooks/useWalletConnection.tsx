
import { useWalletState } from './wallet/useWalletState';
import { useWalletConnection as useWalletConnectionLogic } from './wallet/useWalletConnection';
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
  } = useWalletConnectionLogic(
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setIsWalletConnecting
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

  // Use network effect with correct parameters
  useWalletNetwork(
    walletAddress,
    setIsWalletConnected,
    setCurrentNetwork,
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
