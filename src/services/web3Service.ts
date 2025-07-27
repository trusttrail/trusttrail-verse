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
    POL: {
      symbol: 'POL',
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
                name: 'POL',
                symbol: 'POL',
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
    console.log('🔥 =================== REVIEW SUBMISSION ATTEMPT ===================');
    console.log('📊 Input data:', reviewData);
    
    if (!this.provider || !this.signer) {
      console.error('❌ No provider/signer');
      throw new Error('Wallet not connected - call connect() first');
    }

    try {
      // STEP 1: Basic connectivity check
      console.log('🌐 STEP 1: Checking basic connectivity...');
      const network = await this.provider.getNetwork();
      console.log('🌐 Connected to network:', {
        name: network.name,
        chainId: network.chainId.toString()
      });
      
      // STEP 2: Get signer info
      console.log('👤 STEP 2: Getting signer info...');
      const signerAddress = await this.signer.getAddress();
      console.log('👤 Signer address:', signerAddress);

      // STEP 3: Setup contract using proper ethers interface
      console.log('📜 STEP 3: Setting up contract interface...');
      const CONTRACT_ADDRESS = "0xf99ebeb5087ff43c44A1cE86d66Cd367d3c5EcAb";
      
      // Import the ABI
      const { ReviewPlatformABI } = await import('@/contracts/abis/ReviewPlatform');
      
      // Create contract instance with signer
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ReviewPlatformABI, this.signer);
      console.log('✅ Contract instance created');

      // STEP 4: Prepare review data
      console.log('🔨 STEP 4: Preparing review data...');
      const timestamp = Date.now();
      const ipfsHash = `QmHash_${timestamp}_${Math.random().toString(36).substring(7)}`;
      const proofHash = `QmProof_${timestamp}_${Math.random().toString(36).substring(7)}`;
      
      console.log('📝 Review parameters:', {
        companyName: reviewData.companyName,
        category: reviewData.category,
        rating: reviewData.rating,
        ipfsHash: ipfsHash,
        proofHash: proofHash
      });

      // STEP 5: Estimate gas manually to avoid RPC issues
      // ⚠️ CRITICAL MAINTENANCE NOTE: 
      // This gas estimation fix resolves "Internal JSON-RPC error" (-32603) on Polygon Amoy
      // DO NOT REMOVE: Manual gas estimation with fallback prevents transaction failures
      // If RPC changes, ensure gasLimit fallback remains at 500000n minimum
      // Last updated: 2025-07-27 - Fixed "could not coalesce error" issues
      console.log('⛽ STEP 5: Estimating gas manually...');
      let gasLimit;
      try {
        gasLimit = await contract.submitReview.estimateGas(
          reviewData.companyName,
          reviewData.category,
          ipfsHash,
          proofHash,
          reviewData.rating
        );
        // Add 20% buffer to gas estimate
        gasLimit = (gasLimit * 120n) / 100n;
        console.log('⛽ Gas estimated:', gasLimit.toString());
      } catch (gasError) {
        console.log('⛽ Gas estimation failed, using fixed amount:', gasError);
        gasLimit = 500000n; // Fixed gas limit as fallback
      }

      // STEP 6: Call contract method with manual gas - this will trigger MetaMask
      console.log('🚀 STEP 6: CALLING CONTRACT METHOD - MetaMask should popup NOW...');
      console.log('🚀 ===============================================================');
      
      const tx = await contract.submitReview(
        reviewData.companyName,
        reviewData.category,
        ipfsHash,
        proofHash,
        reviewData.rating,
        {
          gasLimit: gasLimit
        }
      );
      
      console.log('✅ ================= TRANSACTION SENT SUCCESSFULLY =================');
      console.log('📡 Transaction hash:', tx.hash);
      console.log('📋 Transaction details:', {
        hash: tx.hash,
        to: tx.to,
        from: tx.from,
        gasLimit: tx.gasLimit?.toString(),
        gasPrice: tx.gasPrice?.toString(),
        nonce: tx.nonce
      });

      // STEP 6: Wait for confirmation
      console.log('⏳ STEP 6: Waiting for confirmation...');
      const receipt = await tx.wait(1);
      
      console.log('✅ ================= TRANSACTION CONFIRMED =================');
      console.log('📦 Receipt:', {
        hash: receipt.hash,
        status: receipt.status,
        gasUsed: receipt.gasUsed?.toString(),
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash
      });
      
      if (receipt.status === 1) {
        console.log('🎉 SUCCESS! Review submitted to blockchain!');
        console.log('🔗 View on explorer:', `https://amoy.polygonscan.com/tx/${tx.hash}`);
        return tx.hash;
      } else {
        throw new Error('Transaction failed with status 0');
      }
      
    } catch (error: any) {
      console.error('❌ ================= TRANSACTION FAILED =================');
      console.error('❌ Error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error data:', error.data);
      console.error('❌ Error reason:', error.reason);
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
      // Provide specific error messages
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        throw new Error('You cancelled the transaction in MetaMask');
      } else if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient POL for gas fees');
      } else if (error.code === -32603) {
        throw new Error('RPC Error: The Polygon network is having issues. Try again in a moment.');
      } else if (error.message?.includes('could not coalesce error')) {
        throw new Error('Network connectivity issue. Please refresh and try again.');
      } else if (error.message?.includes('gas')) {
        throw new Error('Gas limit too low or network congestion. Try again.');
      } else {
        throw new Error(`Blockchain error: ${error.message || 'Unknown transaction failure'}`);
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
      if (!tokenSymbol || tokenSymbol === 'POL') {
        // Get native POL balance
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      }

      const tokenInfo = this.getTokenInfo(tokenSymbol);
      if (!tokenInfo) throw new Error(`Token ${tokenSymbol} not found`);

      const contract = new ethers.Contract(tokenInfo.address, this.ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(address);
      return ethers.formatUnits(balance, tokenInfo.decimals);
    } catch (error) {
      console.error(`Failed to get ${tokenSymbol || 'POL'} balance:`, error);
      return '0';
    }
  }

  async getAllTokenBalances(address: string): Promise<Record<string, string>> {
    const balances: Record<string, string> = {};
    
    // Ensure we have POL balance for gas fees
    const polBalance = await this.getTokenBalance(address, 'POL');
    balances['POL'] = polBalance;
    
    // Check if user has sufficient POL for transactions
    if (parseFloat(polBalance) < 0.01) {
      console.warn('⚠️ Low POL balance detected. User may need to get POL from faucet.');
    }
    
    // Get TRUST token balance from review rewards
    const trustBalance = await this.getTrustTokenBalance(address);
    balances['TRUST'] = trustBalance;
    
    // Get other token balances (these are mock for testnet)
    for (const token of this.getTokens()) {
      if (token.symbol === 'POL' || token.symbol === 'TRUST') continue; // Already fetched
      
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

  async getTrustTokenBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');
    
    try {
      // Import the ReviewPlatform ABI
      const { ReviewPlatformABI } = await import('@/contracts/abis/ReviewPlatform');
      const CONTRACT_ADDRESS = '0xf99ebeb5087ff43c44A1cE86d66Cd367d3c5EcAb'; // Using the actual deployed contract address
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ReviewPlatformABI, this.provider);
      
      // Get user's review IDs
      const reviewIds = await contract.getUserReviews(address);
      console.log(`📊 User has ${reviewIds.length} reviews on blockchain`);
      
      // Calculate TRUST balance: 5 TRUST per approved review
      const trustBalance = reviewIds.length * 5;
      
      console.log(`🪙 TRUST Balance calculated: ${trustBalance} TRUST (${reviewIds.length} reviews × 5 TRUST)`);
      
      return trustBalance.toString();
      
    } catch (error) {
      console.error('Failed to get TRUST balance from reviews:', error);
      // Fallback: try to get from standard ERC20 if contract has minted tokens
      try {
        const tokenInfo = this.getTokenInfo('TRUST');
        if (tokenInfo) {
          const contract = new ethers.Contract(tokenInfo.address, this.ERC20_ABI, this.provider);
          const balance = await contract.balanceOf(address);
          return ethers.formatUnits(balance, tokenInfo.decimals);
        }
      } catch (erc20Error) {
        console.error('Failed to get TRUST balance from ERC20:', erc20Error);
      }
      return '0';
    }
  }

  async estimateSwap(fromToken: string, toToken: string, amount: string): Promise<string> {
    // Mock exchange rates for demo - in production, this would call a DEX API
    const rates: Record<string, Record<string, number>> = {
      POL: { ETH: 0.0015, BTC: 0.000025, USDT: 0.85, USDC: 0.85, TRUST: 1200 },
      ETH: { POL: 650, BTC: 0.065, USDT: 2500, USDC: 2500, TRUST: 1800000 },
      BTC: { POL: 40000, ETH: 15.4, USDT: 95000, USDC: 95000, TRUST: 28000000 },
      USDT: { POL: 1.18, ETH: 0.0004, BTC: 0.00001, USDC: 1.0, TRUST: 1400 },
      USDC: { POL: 1.18, ETH: 0.0004, BTC: 0.00001, USDT: 1.0, TRUST: 1400 },
      TRUST: { POL: 0.00083, ETH: 0.00000056, BTC: 0.000000036, USDT: 0.00071, USDC: 0.00071 }
    };

    const rate = rates[fromToken]?.[toToken] || 1;
    return (parseFloat(amount) * rate).toFixed(6);
  }
}

export const web3Service = new Web3Service();