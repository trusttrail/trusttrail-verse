
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
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9',
      decimals: 18,
      icon: '⟠'
    },
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin',
      address: '0x85E44420b6137bbc75a85CAB5c9A3371af976FdE',
      decimals: 8,
      icon: '₿'
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether',
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

  getExplorerUrl(txHash: string): string {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  }

  isContractsDeployed(): boolean {
    // Mock implementation - in production this would check if contracts are deployed
    return true;
  }

  async submitReview(reviewData: any): Promise<string> {
    console.log('🔥 submitReview called with data:', reviewData);
    if (!this.provider || !this.signer) {
      console.error('❌ Provider or signer not available:', { provider: !!this.provider, signer: !!this.signer });
      throw new Error('Wallet not connected - call connect() first');
    }

    try {
      console.log('🔗 Starting review submission transaction...');
      console.log('📊 Review data for blockchain:', reviewData);

      // Ensure we're on the correct network
      await this.checkNetwork();
      
      // Get the current account to ensure we have a valid signer
      const signerAddress = await this.signer.getAddress();
      console.log('👤 Signer address:', signerAddress);

      // Check balance to ensure user has enough MATIC
      const balance = await this.provider.getBalance(signerAddress);
      const balanceInMatic = Number(balance) / 1e18;
      console.log('💰 Current MATIC balance:', balanceInMatic);

      if (balanceInMatic < 0.01) {
        throw new Error(`Insufficient MATIC balance: ${balanceInMatic.toFixed(4)} MATIC. Get free MATIC from https://faucet.polygon.technology/`);
      }

      // Create a null transaction to Polygon Amoy null address with review data
      // This is a standard way to store data on blockchain without needing a deployed contract
      const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

      // Create review data as transaction input data
      const reviewDataString = JSON.stringify({
        company: reviewData.companyName,
        title: reviewData.title,
        content: reviewData.content?.substring(0, 100) || "",
        rating: reviewData.rating,
        category: reviewData.category,
        timestamp: reviewData.timestamp,
        reviewer: signerAddress
      });

      // Convert review data to hex
      const reviewDataHex = ethers.hexlify(ethers.toUtf8Bytes(reviewDataString));

      console.log('📝 Review data hex:', reviewDataHex);

      // Prepare transaction to null address with review data
      const txRequest = {
        to: NULL_ADDRESS,
        value: ethers.parseEther('0'), // No value needed
        data: reviewDataHex, // Review data as transaction data
        gasLimit: 50000 // Sufficient gas for data transaction
      };

      console.log('🚀 Transaction request prepared:', txRequest);
      console.log('⚡ About to send transaction - MetaMask should popup now...');

      // Send transaction with review data
      const tx = await this.signer.sendTransaction(txRequest);
      
      console.log('✅ Transaction object returned:', tx);
      console.log('📡 Transaction sent! Hash:', tx.hash);
      console.log('⏳ Waiting for confirmation...');

      // Wait for confirmation  
      const receipt = await tx.wait(1);
      
      if (receipt && receipt.status === 1) {
        console.log('✅ Transaction confirmed successfully:', receipt);
        return tx.hash;
      } else {
        throw new Error('Transaction failed during confirmation');
      }
      
    } catch (error: any) {
      console.error('❌ submitReview failed:', error);
      
      // Re-throw with more specific error messages
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient MATIC for transaction fees');
      } else if (error.message?.includes('Insufficient MATIC balance')) {
        throw error; // Re-throw our custom balance error
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network connection failed');
      } else {
        throw error; // Re-throw original error
      }
    }
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
      MATIC: { ETH: 0.0015, BTC: 0.000025, USDT: 0.85, USDC: 0.85, TRUST: 1200 },
      ETH: { MATIC: 650, BTC: 0.065, USDT: 2500, USDC: 2500, TRUST: 1800000 },
      BTC: { MATIC: 40000, ETH: 15.4, USDT: 95000, USDC: 95000, TRUST: 28000000 },
      USDT: { MATIC: 1.18, ETH: 0.0004, BTC: 0.00001, USDC: 1.0, TRUST: 1400 },
      USDC: { MATIC: 1.18, ETH: 0.0004, BTC: 0.00001, USDT: 1.0, TRUST: 1400 },
      TRUST: { MATIC: 0.00083, ETH: 0.00000056, BTC: 0.000000036, USDT: 0.00071, USDC: 0.00071 }
    };

    const rate = rates[fromToken]?.[toToken] || 1;
    return (parseFloat(amount) * rate).toFixed(6);
  }
}

export const web3Service = new Web3Service();
