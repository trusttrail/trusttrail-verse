import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkWalletExists, linkWalletToProfile } from '@/utils/authUtils';
import { useAuth } from '@/hooks/useAuth';

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
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentNetwork, setCurrentNetwork] = useState<string>("amoy");
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState<boolean>(false);
  const [needsSignup, setNeedsSignup] = useState<boolean>(false);
  const [existingUser, setExistingUser] = useState<boolean>(false);

  // Set Amoy as default network
  const AMOY_CHAIN_ID = '0x13882'; // 80002 (Amoy, Polygon testnet)
  const AMOY_NETWORK_NAME = 'Polygon Amoy (Testnet)';

  // Check if MetaMask is installed
  useEffect(() => {
    setIsMetaMaskAvailable(!!window.ethereum);
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        // Accept Amoy testnet as valid
        if (chainId === AMOY_CHAIN_ID) {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          localStorage.setItem('connected_wallet_address', address);

          // Check if this wallet exists in our database
          const { exists, userId } = await checkWalletExists(address);
          
          if (exists && !isAuthenticated) {
            setExistingUser(true);
            toast({
              title: "Wallet Recognized",
              description: "Please sign in to continue with your existing account.",
            });
          } else if (!exists && !isAuthenticated) {
            setNeedsSignup(true);
            toast({
              title: "New Wallet Detected",
              description: "Please create an account to link this wallet.",
            });
          } else if (isAuthenticated && user) {
            // Link wallet to current user if not already linked
            await linkWalletToProfile(user.id, address);
            toast({
              title: "Wallet Connected",
              description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
          }
        } else {
          // Auto-disconnect if on wrong network
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
          toast({
            title: "Wrong Network",
            description: `Please switch to ${AMOY_NETWORK_NAME} in your MetaMask wallet to connect.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  // Connect wallet handler for MetaMask
  const connectWallet = async () => {
    try {
      setIsWalletConnecting(true);
      if (!window.ethereum) {
        toast({
          title: "No Wallet Detected",
          description: "No MetaMask or compatible wallet extension found.",
          variant: "destructive",
        });
        setIsWalletConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem('connected_wallet_address', address);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== AMOY_CHAIN_ID) {
          setIsWalletConnected(false);
          setCurrentNetwork("wrong");
          toast({
            title: "Wrong Network",
            description: `Please switch to ${AMOY_NETWORK_NAME} in your MetaMask wallet to connect.`,
            variant: "destructive",
          });
        } else {
          setIsWalletConnected(true);
          setCurrentNetwork("amoy");
          const { exists, userId } = await checkWalletExists(address);
          
          if (exists && !isAuthenticated) {
            setExistingUser(true);
            setNeedsSignup(false);
            toast({
              title: "Wallet Recognized",
              description: "Please sign in to continue with your existing account.",
            });
          } else if (!exists && !isAuthenticated) {
            setNeedsSignup(true);
            setExistingUser(false);
            toast({
              title: "New Wallet Connected",
              description: "Please create an account to link this wallet and start writing reviews.",
            });
          } else if (isAuthenticated && user) {
            // Link wallet to current user
            const linkResult = await linkWalletToProfile(user.id, address);
            if (linkResult.success) {
              setNeedsSignup(false);
              setExistingUser(false);
              toast({
                title: "Wallet Linked",
                description: `Wallet connected and linked to your account!`,
              });
            }
          } else {
            toast({
              title: "Wallet Connected",
              description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
          }
        }
      }
      setIsWalletConnecting(false);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setIsWalletConnecting(false);
    }
  };

  // Connect with WalletConnect
  const connectWithWalletConnect = async () => {
    try {
      setIsWalletConnecting(true);
      
      toast({
        title: "WalletConnect",
        description: "To fully implement WalletConnect, we would need to install the WalletConnect SDK library. This is a UI demonstration.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "WalletConnect Ready",
        description: "Scan a QR code with your mobile wallet to connect.",
      });
      
      setIsWalletConnecting(false);
    } catch (error) {
      console.error("Error connecting with WalletConnect:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to initialize WalletConnect. Please try again.",
        variant: "destructive",
      });
      setIsWalletConnecting(false);
    }
  };

  // Disconnect wallet handler
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setNeedsSignup(false);
    setExistingUser(false);
    
    localStorage.setItem('wallet_disconnected', 'true');
    localStorage.removeItem('connected_wallet_address');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected. Refresh the page to reconnect.",
    });
  };

  // Network change handler
  const handleNetworkChange = (network: string) => {
    if (network !== "amoy") {
      toast({
        title: "Network Not Supported",
        description: `Currently only ${AMOY_NETWORK_NAME} is supported in the testnet dApp.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentNetwork("amoy");
    toast({
      title: "Network Changed",
      description: `Switched to ${AMOY_NETWORK_NAME}.`,
    });
  };

  // Listen for account changes and chain changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
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

        window.ethereum?.request({ method: 'eth_chainId' }).then(async (chainId) => {
          if (chainId === AMOY_CHAIN_ID) {
            setIsWalletConnected(true);
            setCurrentNetwork("amoy");
            const { exists } = await checkWalletExists(newAddress);

            if (exists && !isAuthenticated) {
              setExistingUser(true);
              setNeedsSignup(false);
              toast({
                title: "Account Changed - Recognized Wallet",
                description: "Please sign in to continue with this account.",
              });
            } else if (!exists && !isAuthenticated) {
              setNeedsSignup(true);
              setExistingUser(false);
              toast({
                title: "Account Changed - New Wallet",
                description: "Please create an account for this wallet.",
              });
            } else {
              toast({
                title: "Account Changed",
                description: `Connected to ${newAddress.substring(0, 6)}...${newAddress.substring(newAddress.length - 4)}`,
              });
            }
          } else {
            setIsWalletConnected(false);
            setCurrentNetwork("wrong");
          }
        });
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
  }, [walletAddress, isWalletConnected, isAuthenticated, user, toast]);

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
  }, [isAuthenticated, user, isWalletConnected, walletAddress]);

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
