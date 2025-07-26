
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

      // Your deployed TrustTrailReviews contract on Polygon Amoy
      const TRUST_TRAIL_CONTRACT_ADDRESS = "0xf99ebeb5087ff43c44A1cE86d66Cd367d3c5EcAb";

      console.log('🚀 Using TrustTrailReviews contract at:', TRUST_TRAIL_CONTRACT_ADDRESS);

      // First, let's verify the contract exists and get its code
      try {
        const contractCode = await this.provider.getCode(TRUST_TRAIL_CONTRACT_ADDRESS);
        console.log('📜 Contract code length:', contractCode.length);
        console.log('📜 Contract exists:', contractCode !== '0x');
        
        if (contractCode === '0x') {
          throw new Error(`Contract not found at address ${TRUST_TRAIL_CONTRACT_ADDRESS}. The contract may not be deployed or the address is incorrect.`);
        }
      } catch (error) {
        console.error('❌ Failed to verify contract:', error);
        throw new Error('Failed to verify contract deployment');
      }

      // Let's try the original ABI approach first since manual encoding might have issues
      const REVIEW_ABI = [
        "function submitReview(string memory _companyName, string memory _category, string memory _ipfsHash, string memory _proofIpfsHash, uint8 _rating) public"
      ];

      console.log('🔨 Creating contract instance with ABI...');
      const contract = new ethers.Contract(TRUST_TRAIL_CONTRACT_ADDRESS, REVIEW_ABI, this.signer);
      
      // Create timestamped IPFS hashes
      const timestamp = Date.now();
      const ipfsHash = `QmHash_${timestamp}_${Math.random().toString(36).substring(7)}`;
      const proofHash = `QmProofHash_${timestamp}_${Math.random().toString(36).substring(7)}`;
      
      console.log('📊 Final parameters for contract call:', {
        companyName: reviewData.companyName,
        category: reviewData.category,
        ipfsHash,
        proofHash,
        rating: reviewData.rating
      });

      // Estimate gas first
      console.log('⛽ Estimating gas...');
      let gasEstimate;
      try {
        gasEstimate = await contract.submitReview.estimateGas(
          reviewData.companyName,
          reviewData.category,
          ipfsHash,
          proofHash,
          reviewData.rating
        );
        console.log('⛽ Gas estimate:', gasEstimate.toString());
      } catch (gasError) {
        console.error('❌ Gas estimation failed:', gasError);
        console.log('🔄 Proceeding with fixed gas limit...');
        gasEstimate = 300000; // Fallback gas limit
      }

      console.log('🚀 Calling contract.submitReview() - MetaMask should popup now...');
      
      const tx = await contract.submitReview(
        reviewData.companyName,
        reviewData.category,
        ipfsHash,
        proofHash,
        reviewData.rating,
        {
          gasLimit: Math.max(Number(gasEstimate) * 1.2, 300000) // 20% buffer or minimum 300k
        }
      );
      
      console.log('✅ Transaction object returned:', tx);
      console.log('📡 Transaction sent! Hash:', tx.hash);
      console.log('⏳ Waiting for confirmation...');

      // Wait for confirmation  
      const receipt = await tx.wait(1);
      
      if (receipt && receipt.status === 1) {
        console.log('✅ Transaction confirmed successfully:', receipt);
        console.log('🎉 Review submitted to TrustTrailReviews contract!');
        return tx.hash;
      } else {
        console.error('❌ Transaction failed with receipt:', receipt);
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
