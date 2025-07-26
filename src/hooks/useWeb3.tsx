
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { web3Service, Web3Service, TokenInfo } from '../services/web3Service';
import { useToast } from './use-toast';

interface Web3ContextType {
  web3Service: Web3Service;
  isConnected: boolean;
  address: string;
  currentNetwork: string;
  connectWallet: () => Promise<void>;
  isLoading: boolean;
  tokenBalances: Record<string, string>;
  refreshBalances: () => Promise<void>;
  tokens: TokenInfo[];
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const walletAddress = await web3Service.connect();
      setAddress(walletAddress);
      setIsConnected(true);
      setCurrentNetwork(web3Service.getCurrentNetwork());
      
      // Get all token balances
      await refreshBalances();
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Web3 wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalances = async () => {
    if (address && isConnected) {
      try {
        const balances = await web3Service.getAllTokenBalances(address);
        setTokenBalances(balances);
      } catch (error) {
        console.error('Failed to get token balances:', error);
      }
    }
  };

  useEffect(() => {
    // Check if wallet is already connected using proper Web3 API
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            setCurrentNetwork(web3Service.getCurrentNetwork());
            refreshBalances();
          }
        } catch (error) {
          console.error('Failed to check existing connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  const value: Web3ContextType = {
    web3Service,
    isConnected,
    address,
    currentNetwork,
    connectWallet,
    isLoading,
    tokenBalances,
    refreshBalances,
    tokens: web3Service.getTokens()
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    // Return default values instead of throwing an error to prevent crashes
    console.warn('useWeb3 hook used outside of Web3Provider - using default values');
    return {
      web3Service,
      isConnected: false,
      address: '',
      currentNetwork: '',
      connectWallet: async () => {
        console.warn('Wallet connection attempted outside of Web3Provider');
      },
      isLoading: false,
      tokenBalances: {},
      refreshBalances: async () => {},
      tokens: []
    };
  }
  return context;
};
