
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
    checkIfWalletIsConnected, 
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

  const checkIfWalletIsConnectedWithAuth = async () => {
    console.log('Checking wallet connection with auth...');
    const address = await checkIfWalletIsConnected();
    if (address) {
      console.log('Wallet found, checking auth status for:', address);
      await handleWalletConnection(address);
    } else {
      console.log('No wallet connected');
    }
  };

  const connectWallet = async () => {
    console.log('Connecting wallet...');
    const address = await baseConnectWallet();
    if (address) {
      console.log('Wallet connected, checking auth status for:', address);
      await handleWalletConnection(address);
    } else {
      console.log('Wallet connection failed or cancelled');
    }
  };

  return {
    checkIfWalletIsConnected: checkIfWalletIsConnectedWithAuth,
    connectWallet,
    connectWithWalletConnect,
  };
};
