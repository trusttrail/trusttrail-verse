/**
 * Multi-wallet provider detection and connection utilities
 * 
 * Supports: MetaMask, Rainbow, Trust Wallet, Backpack, Coinbase Wallet, 
 * Phantom, and other EIP-1193 compatible wallets
 */

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  downloadUrl: string;
  isInstalled: () => boolean;
  getProvider: () => any;
  isInjected: boolean;
}

export interface DetectedWallet {
  provider: WalletProvider;
  instance: any;
}

// Wallet provider definitions
export const WALLET_PROVIDERS: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    downloadUrl: 'https://metamask.io/download/',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             !!(window as any).ethereum && 
             !!(window as any).ethereum.isMetaMask;
    },
    getProvider: () => (window as any).ethereum,
    isInjected: true
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDQ4QzM3LjI1NDggNDggNDggMzcuMjU0OCA0OCAyNEM0OCAxMC43NDUyIDM3LjI1NDggMCAyNCAwQzEwLjc0NTIgMCAwIDEwLjc0NTIgMCAyNEMwIDM3LjI1NDggMTAuNzQ1MiA0OCAyNCA0OFoiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xXzIpIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMV8yIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDI0IDI0KSByb3RhdGUoOTApIHNjYWxlKDI0KSI+CjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI0ZGNTRBMCIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzAwRDJGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMTAwRkYiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
    downloadUrl: 'https://rainbow.me/download',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             !!(window as any).ethereum && 
             !!(window as any).ethereum.isRainbow;
    },
    getProvider: () => (window as any).ethereum,
    isInjected: true
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDQwQzMxLjA0NTcgNDAgNDAgMzEuMDQ1NyA0MCAyMEM0MCA4Ljk1NDMgMzEuMDQ1NyAwIDIwIDBDOC45NTQzIDAgMCA4Ljk1NDMgMCAyMEMwIDMxLjA0NTcgOC45NTQzIDQwIDIwIDQwWiIgZmlsbD0iIzNGNzVGRiIvPgo8cGF0aCBkPSJNMjAgMzJMMTIgMjRIMjhMMjAgMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    downloadUrl: 'https://trustwallet.com/download',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             !!(window as any).ethereum && 
             !!(window as any).ethereum.isTrust;
    },
    getProvider: () => (window as any).ethereum,
    isInjected: true
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwNTJGRiIvPgo8cGF0aCBkPSJNMjAgMjhDMjQuNDE4MyAyOCAyOCAyNC40MTgzIDI4IDIwQzI4IDE1LjU4MTcgMjQuNDE4MyAxMiAyMCAxMkMxNS41ODE3IDEyIDEyIDE1LjU4MTcgMTIgMjBDMTIgMjQuNDE4MyAxNS41ODE3IDI4IDIwIDI4WiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTciIHk9IjE3IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgZmlsbD0iIzAwNTJGRiIvPgo8L3N2Zz4K',
    downloadUrl: 'https://www.coinbase.com/wallet',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             (!!(window as any).ethereum?.isCoinbaseWallet || 
              !!(window as any).coinbaseWalletExtension);
    },
    getProvider: () => (window as any).ethereum || (window as any).coinbaseWalletExtension,
    isInjected: true
  },
  {
    id: 'backpack',
    name: 'Backpack',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0U0M0M3RSIvPgo8cGF0aCBkPSJNMjAgMzBMMTIgMjJIMjhMMjAgMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgMThMMTIgMTBIMjhMMjAgMThaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    downloadUrl: 'https://backpack.app/download',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             !!(window as any).backpack;
    },
    getProvider: () => (window as any).backpack?.ethereum,
    isInjected: true
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzUzNDI5NCIvPgo8cGF0aCBkPSJNMjAgMzBDMjYuNjI3NCAzMCAzMiAyNC42Mjc0IDMyIDIwQzMyIDE1LjM3MjYgMjYuNjI3NCAxMCAyMCAxMEMxMy4zNzI2IDEwIDggMTUuMzcyNiA4IDIwQzggMjQuNjI3NCAxMy4zNzI2IDMwIDIwIDMwWiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxOCIgcj0iMiIgZmlsbD0iIzUzNDI5NCIvPgo8Y2lyY2xlIGN4PSIyNCIgY3k9IjE4IiByPSIyIiBmaWxsPSIjNTM0Mjk0Ii8+Cjwvc3ZnPgo=',
    downloadUrl: 'https://phantom.app/download',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             !!(window as any).phantom?.ethereum;
    },
    getProvider: () => (window as any).phantom?.ethereum,
    isInjected: true
  },
  {
    id: 'brave',
    name: 'Brave Wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGNTUwMCIvPgo8cGF0aCBkPSJNMjAgMzBMMTAgMjBMMjAgMTBMMzAgMjBMMjAgMzBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    downloadUrl: 'https://brave.com/wallet/',
    isInstalled: () => {
      return typeof window !== 'undefined' && 
             !!(window as any).ethereum && 
             !!(window as any).ethereum.isBraveWallet;
    },
    getProvider: () => (window as any).ethereum,
    isInjected: true
  }
];

/**
 * Detect all available wallet providers on the current page
 */
export const detectWallets = (): DetectedWallet[] => {
  if (typeof window === 'undefined') return [];

  const detectedWallets: DetectedWallet[] = [];

  for (const walletProvider of WALLET_PROVIDERS) {
    if (walletProvider.isInstalled()) {
      const provider = walletProvider.getProvider();
      if (provider) {
        detectedWallets.push({
          provider: walletProvider,
          instance: provider
        });
      }
    }
  }

  // Sort MetaMask first, then Rainbow, then others alphabetically
  return detectedWallets.sort((a, b) => {
    if (a.provider.id === 'metamask') return -1;
    if (b.provider.id === 'metamask') return 1;
    if (a.provider.id === 'rainbow') return -1;
    if (b.provider.id === 'rainbow') return 1;
    return a.provider.name.localeCompare(b.provider.name);
  });
};

/**
 * Get the primary wallet provider (first detected or MetaMask)
 */
export const getPrimaryWallet = (): DetectedWallet | null => {
  const wallets = detectWallets();
  
  // Prioritize MetaMask if available
  const metamask = wallets.find(w => w.provider.id === 'metamask');
  if (metamask) return metamask;
  
  // Otherwise return first available
  return wallets.length > 0 ? wallets[0] : null;
};

/**
 * Connect to a specific wallet provider
 */
export const connectToWallet = async (detectedWallet: DetectedWallet): Promise<string[]> => {
  const { instance } = detectedWallet;
  
  if (!instance) {
    throw new Error(`${detectedWallet.provider.name} is not available`);
  }

  try {
    // Request account access
    const accounts = await instance.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned from wallet');
    }

    return accounts;
  } catch (error: any) {
    // Handle user rejection
    if (error.code === 4001) {
      throw new Error('Connection was rejected by user');
    }
    
    throw new Error(`Failed to connect to ${detectedWallet.provider.name}: ${error.message}`);
  }
};

/**
 * Check if any wallet is already connected
 */
export const checkWalletConnection = async (): Promise<{
  isConnected: boolean;
  address: string | null;
  wallet: DetectedWallet | null;
}> => {
  const wallets = detectWallets();
  
  for (const wallet of wallets) {
    try {
      const accounts = await wallet.instance.request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts && accounts.length > 0) {
        return {
          isConnected: true,
          address: accounts[0],
          wallet
        };
      }
    } catch (error) {
      // Continue checking other wallets
      console.warn(`Error checking ${wallet.provider.name}:`, error);
    }
  }

  return {
    isConnected: false,
    address: null,
    wallet: null
  };
};

/**
 * Get wallet info by provider instance
 */
export const getWalletInfo = (provider: any): WalletProvider | null => {
  for (const walletProvider of WALLET_PROVIDERS) {
    if (walletProvider.isInstalled() && walletProvider.getProvider() === provider) {
      return walletProvider;
    }
  }
  return null;
};
