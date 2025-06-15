
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
    const address = await checkIfWalletIsConnected();
    if (address) {
      await handleWalletConnection(address);
    }
  };

  const connectWallet = async () => {
    const address = await baseConnectWallet();
    if (address) {
      await handleWalletConnection(address);
    }
  };

  return {
    checkIfWalletIsConnected: checkIfWalletIsConnectedWithAuth,
    connectWallet,
    connectWithWalletConnect,
  };
};
