
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon: string;
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  // Official token addresses on Polygon Amoy testnet
  private readonly TOKENS: Record<string, TokenInfo> = {
    MATIC: {
      symbol: 'MATIC',
      name: 'Polygon',
      address: '0x0000000000000000000000000000000000000000', // Native token
      decimals: 18,
      icon: '🔷'
    },
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      address: '0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9',
      decimals: 18,
      icon: '⟠'
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      address: '0x85E44420b6137bbc75a85CAB5c9A3371af976FdE',
      decimals: 8,
      icon: '₿'
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0x2c852e740B62308c46DD29B982FBb650D063Bd07',
      decimals: 6,
      icon: '💚'
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
      decimals: 6,
      icon: '🔵'
    },
    TRUST: {
      symbol: 'TRUST',
      name: 'TrustTrail Token',
      address: '0x186389f359713852366b4eA1eb9BC947f68F74ca',
      decimals: 18,
      icon: '🛡️'
    }
  };

  private readonly ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)'
  ];

  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();
      
      // Check if on correct network
      await this.checkNetwork();
      
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async checkNetwork(): Promise<void> {
    if (!this.provider) throw new Error('Wallet not connected');
    
    const network = await this.provider.getNetwork();
    const amoyChainId = 80002n; // Polygon Amoy testnet chain ID
    
    if (network.chainId !== amoyChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13882' }], // 80002 in hex
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Network not added, add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x13882',
              chainName: 'Polygon Amoy Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://rpc-amoy.polygon.technology/'],
              blockExplorerUrls: ['https://amoy.polygonscan.com/']
            }]
          });
        } else {
          throw switchError;
        }
      }
    }
  }

  getCurrentNetwork(): string {
    return "amoy";
  }

  getContractAddresses() {
    return {
      explorerUrl: 'https://amoy.polygonscan.com/',
    };
  }

  getTokens(): TokenInfo[] {
    return Object.values(this.TOKENS);
  }

  getTokenInfo(symbol: string): TokenInfo | undefined {
    return this.TOKENS[symbol.toUpperCase()];
  }

  async getTokenBalance(address: string, tokenSymbol?: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');

    try {
      if (!tokenSymbol || tokenSymbol === 'MATIC') {
        // Get native MATIC balance
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      }

      const tokenInfo = this.getTokenInfo(tokenSymbol);
      if (!tokenInfo) throw new Error(`Token ${tokenSymbol} not found`);

      const contract = new ethers.Contract(tokenInfo.address, this.ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(address);
      return ethers.formatUnits(balance, tokenInfo.decimals);
    } catch (error) {
      console.error(`Failed to get ${tokenSymbol || 'MATIC'} balance:`, error);
      return '0';
    }
  }

  async getAllTokenBalances(address: string): Promise<Record<string, string>> {
    const balances: Record<string, string> = {};
    
    for (const token of this.getTokens()) {
      try {
        const balance = await this.getTokenBalance(address, token.symbol);
        balances[token.symbol] = balance;
      } catch (error) {
        console.error(`Failed to get balance for ${token.symbol}:`, error);
        balances[token.symbol] = '0';
      }
    }
    
    return balances;
  }

  async estimateSwap(fromToken: string, toToken: string, amount: string): Promise<string> {
    // Mock exchange rates for demo - in production, this would call a DEX API
    const rates: Record<string, Record<string, number>> = {
      MATIC: { WETH: 0.0015, WBTC: 0.000025, USDT: 0.85, USDC: 0.85, TRUST: 1200 },
      WETH: { MATIC: 650, WBTC: 0.065, USDT: 2500, USDC: 2500, TRUST: 1800000 },
      WBTC: { MATIC: 40000, WETH: 15.4, USDT: 95000, USDC: 95000, TRUST: 28000000 },
      USDT: { MATIC: 1.18, WETH: 0.0004, WBTC: 0.00001, USDC: 1.0, TRUST: 1400 },
      USDC: { MATIC: 1.18, WETH: 0.0004, WBTC: 0.00001, USDT: 1.0, TRUST: 1400 },
      TRUST: { MATIC: 0.00083, WETH: 0.00000056, WBTC: 0.000000036, USDT: 0.00071, USDC: 0.00071 }
    };

    const rate = rates[fromToken]?.[toToken] || 1;
    return (parseFloat(amount) * rate).toFixed(6);
  }
}

export const web3Service = new Web3Service();
