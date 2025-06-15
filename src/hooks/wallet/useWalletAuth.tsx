
import { useWalletConnection } from './useWalletConnection';
import { useWalletAuthLogic } from './useWalletAuthLogic';

export const useWalletAuth = (
  setIsWalletConnected: (val: boolean) => void,
  setWalletAddress: (val: string) => void,
  setCurrentNetwork: (val: string) => void,
  setIsWalletConnecting: (val: boolean) => void,
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void
) => {
  const { 
    checkIfWalletIsConnected: baseCheckWallet, 
    connectWallet: baseConnectWallet, 
    connectWithWalletConnect 
  } = useWalletConnection(
    setIsWalletConnected,
    setWalletAddress,
    setCurrentNetwork,
    setIsWalletConnecting
  );

  const { handleWalletConnection } = useWalletAuthLogic(
    setNeedsSignup,
    setExistingUser
  );

  const checkIfWalletIsConnected = async () => {
    console.log('🔍 useWalletAuth: Checking wallet connection with auth...');
    const address = await baseCheckWallet();
    if (address) {
      console.log('🔍 useWalletAuth: Wallet found, checking auth status for:', address);
      await handleWalletConnection(address);
    } else {
      console.log('🔍 useWalletAuth: No wallet connected');
    }
  };

  const connectWallet = async () => {
    console.log('🔌 useWalletAuth: Starting wallet connection...');
    const address = await baseConnectWallet();
    if (address) {
      console.log('🔌 useWalletAuth: Wallet connected, checking auth status for:', address);
      await handleWalletConnection(address);
    } else {
      console.log('🔌 useWalletAuth: Wallet connection failed or cancelled');
    }
  };

  return {
    checkIfWalletIsConnected,
    connectWallet,
    connectWithWalletConnect,
  };
};
