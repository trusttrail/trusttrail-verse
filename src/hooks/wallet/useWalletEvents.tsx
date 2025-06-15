
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { checkWalletExists, linkWalletToProfile, autoSignInWithWallet } from '@/utils/authUtils';
import { AMOY_CHAIN_ID, AMOY_NETWORK_NAME } from "@/constants/network";

export const useWalletEvents = (
  walletAddress: string,
  isWalletConnected: boolean,
  setIsWalletConnected: (val: boolean) => void,
  setWalletAddress: (val: string) => void,
  setCurrentNetwork: (val: string) => void,
  setNeedsSignup: (val: boolean) => void,
  setExistingUser: (val: boolean) => void,
  checkIfWalletIsConnected: () => Promise<void>
) => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const handleWalletChange = async (newAddress: string) => {
    if (!isAuthenticated) {
      const { exists } = await checkWalletExists(newAddress);

      if (exists) {
        // Auto sign-in for existing wallet users
        const autoSignInResult = await autoSignInWithWallet(newAddress);
        
        if (autoSignInResult.success) {
          setExistingUser(false);
          setNeedsSignup(false);
          toast({
            title: "Wallet Recognized - Auto Sign In",
            description: `Automatically signing you in with ${autoSignInResult.email}...`,
          });
        } else {
          // Fallback to manual sign-in prompt
          setExistingUser(true);
          setNeedsSignup(false);
          toast({
            title: "Wallet Recognized",
            description: "This wallet is linked to an existing account. Please sign in to continue.",
          });
        }
      } else {
        setNeedsSignup(true);
        setExistingUser(false);
        toast({
          title: "New Wallet Detected",
          description: "This wallet needs to be linked to an account. Please create an account to continue.",
        });
      }
    } else {
      // User is already authenticated, just show the change
      toast({
        title: "Account Changed",
        description: `Connected to ${newAddress.substring(0, 6)}...${newAddress.substring(newAddress.length - 4)}`,
      });
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsWalletConnected(false);
        setWalletAddress("");
        setNeedsSignup(false);
        setExistingUser(false);
        localStorage.removeItem('connected_wallet_address');
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
      } else if (accounts[0] !== walletAddress) {
        const newAddress = accounts[0];
        setWalletAddress(newAddress);
        localStorage.setItem('connected_wallet_address', newAddress);

        const chainId = await window.ethereum?.request({ method: 'eth_chainId' });
        if (chainId === AMOY_CHAIN_ID) {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          
          await handleWalletChange(newAddress);
        } else {
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (chainId !== AMOY_CHAIN_ID) {
        setIsWalletConnected(false);
        setCurrentNetwork("wrong");
        toast({
          title: "Wrong Network",
          description: `Wallet disconnected. Please switch to ${AMOY_NETWORK_NAME} and reconnect.`,
          variant: "destructive",
        });
      } else {
        if (walletAddress && !isWalletConnected) {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          toast({
            title: "Network Changed",
            description: `Connected to ${AMOY_NETWORK_NAME}.`,
          });
        }
      }
    };

    const hasDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
    if (!hasDisconnected) {
      checkIfWalletIsConnected();
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletAddress, isWalletConnected, isAuthenticated, user, toast, checkIfWalletIsConnected, setIsWalletConnected, setWalletAddress, setCurrentNetwork, setNeedsSignup, setExistingUser]);

  // Clear signup/existing user flags when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user && isWalletConnected) {
      setNeedsSignup(false);
      setExistingUser(false);
      
      // Link wallet to user profile if we have a connected wallet
      if (walletAddress) {
        linkWalletToProfile(user.id, walletAddress);
      }
    }
  }, [isAuthenticated, user, isWalletConnected, walletAddress, setNeedsSignup, setExistingUser]);
};
