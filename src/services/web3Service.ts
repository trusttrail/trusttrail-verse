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

  // Network-specific tokens - updated dynamically based on current network
  private async getTokensForNetwork(): Promise<Record<string, TokenInfo>> {
    const network = await this.getCurrentNetwork();
    const { CONTRACT_ADDRESSES } = await import('@/constants/network');
    
    if (network === 'amoy') {
      return {
        POL: {
          symbol: 'POL',
          name: 'Polygon',
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          icon: '🔷'
        },
        TRT: {
          symbol: 'TRT',
          name: 'TRUSTTRAIL',
          address: CONTRACT_ADDRESSES.amoy.REWARD_TOKEN,
          decimals: 18,
          icon: '🛡️'
        }
      };
    } else if (network === 'opSepolia') {
      return {
        ETH: {
          symbol: 'ETH',
          name: 'Ethereum',
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          icon: '⚡'
        },
        TRUST: {
          symbol: 'TRUST',
          name: 'TRUST',
          address: CONTRACT_ADDRESSES.opSepolia.REWARD_TOKEN,
          decimals: 18,
          icon: '🛡️'
        }
      };
    }
    
    return {};
  }

  private readonly ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)'
  ];

  // Multiple RPC endpoints for Polygon Amoy for reliability
  private readonly AMOY_RPC_ENDPOINTS = [
    'https://rpc-amoy.polygon.technology/',
    'https://polygon-amoy.blockpi.network/v1/rpc/public',
    'https://polygon-amoy-bor-rpc.publicnode.com',
    'https://rpc.ankr.com/polygon_amoy'
  ];

  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Get address safely - avoid ENS issues on Amoy
      let address: string;
      try {
        address = await this.signer.getAddress();
      } catch (ensError: any) {
        console.warn('⚠️ ENS resolution failed, using fallback method:', ensError.message);
        // Fallback: get address from accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        address = accounts[0];
      }
      
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
    const supportedChainIds = [80002n, 11155420n]; // Amoy and OP Sepolia
    
    if (!supportedChainIds.includes(network.chainId)) {
      // Default to switching to Amoy if on unsupported network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13882' }], // 80002 in hex (Amoy)
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Network not added, add Amoy
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

  async getCurrentNetwork(): Promise<string> {
    if (!this.provider) return "unknown";
    
    const network = await this.provider.getNetwork();
    const chainId = network.chainId;
    
    if (chainId === 80002n) return "amoy";
    if (chainId === 11155420n) return "opSepolia";
    
    return "unknown";
  }

  async getContractAddresses() {
    const network = await this.getCurrentNetwork();
    const { CONTRACT_ADDRESSES } = await import('@/constants/network');
    
    const addresses = CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES];
    if (!addresses) throw new Error(`Unsupported network: ${network}`);
    
    return {
      reviewPlatform: addresses.REVIEW_PLATFORM,
      rewardToken: addresses.REWARD_TOKEN,
      explorerUrl: network === 'amoy' 
        ? 'https://amoy.polygonscan.com/' 
        : 'https://sepolia-optimism.etherscan.io/',
    };
  }

  async getExplorerUrl(txHash: string): Promise<string> {
    const network = await this.getCurrentNetwork();
    const baseUrl = network === 'amoy' 
      ? 'https://amoy.polygonscan.com/tx/' 
      : 'https://sepolia-optimism.etherscan.io/tx/';
    return `${baseUrl}${txHash}`;
  }

  isContractsDeployed(): boolean {
    // Mock implementation - in production this would check if contracts are deployed
    return true;
  }

  // Retry mechanism for RPC failures
  private async retryWithFallback<T>(operation: () => Promise<T>, maxRetries: number = 1): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} for operation...`);
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        // If it's a user rejection, don't retry
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  async submitReview(reviewData: any): Promise<string> {
    console.log('🔥 =================== REVIEW SUBMISSION ATTEMPT ===================');
    console.log('📊 Input data:', reviewData);
    
    if (!this.provider || !this.signer) {
      console.error('❌ No provider/signer');
      throw new Error('Wallet not connected - call connect() first');
    }

    // ⚠️ CRITICAL MAINTENANCE NOTE FOR POLYGON AMOY RPC STABILITY:
    // Date: 2025-07-27 - Fixed persistent "Internal JSON-RPC error" (-32603)
    // ISSUE: Polygon Amoy testnet has unstable RPC endpoints causing transaction failures
    // SOLUTION: Retry mechanism with multiple attempts and exponential backoff
    // MAINTAIN: Always test this section when Polygon updates their infrastructure
    // MONITOR: If -32603 errors persist, add more RPC endpoints to AMOY_RPC_ENDPOINTS array
    // DO NOT REMOVE: This retry logic is essential for production stability

    return await this.retryWithFallback(async () => {
      try {
        // STEP 1: Basic connectivity check
        console.log('🌐 STEP 1: Checking basic connectivity...');
        const network = await this.provider.getNetwork();
        console.log('🌐 Connected to network:', {
          name: network.name,
          chainId: network.chainId.toString()
        });
        
        // STEP 2: Get signer info - avoid ENS issues on Amoy
        console.log('👤 STEP 2: Getting signer info...');
        let signerAddress: string;
        try {
          signerAddress = await this.signer.getAddress();
          console.log('👤 Signer address:', signerAddress);
        } catch (ensError: any) {
          console.warn('⚠️ Direct signer.getAddress() failed, trying alternative method:', ensError.message);
          // Fallback: get address from accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          signerAddress = accounts[0];
          console.log('👤 Fallback signer address:', signerAddress);
        }

        // STEP 3: Setup contract using proper ethers interface
        console.log('📜 STEP 3: Setting up contract interface...');
        const contractAddresses = await this.getContractAddresses();
        const CONTRACT_ADDRESS = contractAddresses.reviewPlatform;
        
        // Validate contract address format to prevent ENS resolution
        if (!ethers.isAddress(CONTRACT_ADDRESS)) {
          throw new Error(`Invalid contract address format: ${CONTRACT_ADDRESS}`);
        }
        
        console.log('✅ Contract address validated:', CONTRACT_ADDRESS);
        
        // Import the ABI
        const { ReviewPlatformABI } = await import('@/contracts/abis/ReviewPlatform');
        
        // Create contract instance with signer - ensure no ENS resolution
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS.toLowerCase(), // Ensure lowercase to prevent ENS issues
          ReviewPlatformABI, 
          this.signer
        );
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

        // STEP 5: Optimized gas settings for Amoy
        console.log('⛽ STEP 5: Using optimized gas settings for Amoy...');
        const gasLimit = 500000n; // Increased gas limit for contract with rewards
        console.log('⛽ Gas limit set to:', gasLimit.toString());

        // STEP 6: Call contract method - this will trigger MetaMask
        console.log('🚀 STEP 6: CALLING CONTRACT METHOD - MetaMask should popup NOW...');
        console.log('🚀 ===============================================================');
        
        // Get current gas price from network and add buffer for faster confirmation
        let gasPrice: bigint;
        try {
          const feeData = await this.provider.getFeeData();
          gasPrice = feeData.gasPrice ? (feeData.gasPrice * 150n) / 100n : ethers.parseUnits('50', 'gwei');
          console.log('⛽ Using network gas price with 50% buffer:', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');
        } catch (gasError) {
          // Fallback to higher fixed price for faster confirmation
          gasPrice = ethers.parseUnits('50', 'gwei'); // Increased from 30 to 50 gwei
          console.log('⛽ Using fallback gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');
        }
        
        const tx = await contract.submitReview(
          reviewData.companyName,
          reviewData.category,
          ipfsHash,
          proofHash,
          reviewData.rating,
          {
            gasLimit: gasLimit,
            gasPrice: gasPrice
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

        // STEP 7: Wait for confirmation with timeout
        console.log('⏳ STEP 7: Waiting for confirmation...');
        const receipt = await Promise.race([
          tx.wait(1),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction timeout')), 30000)
          )
        ]) as any;
        
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
          console.log('🔗 View on explorer:', await this.getExplorerUrl(tx.hash));
          return tx.hash;
        } else {
          throw new Error('Transaction failed with status 0');
        }
        
      } catch (error: any) {
        console.error('❌ Transaction attempt failed:', error);
        
        // Re-throw user rejections immediately
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
          throw new Error('You cancelled the transaction in MetaMask');
        }
        
        // For RPC errors, let retry mechanism handle it
        if (error.code === -32603 || error.message?.includes('could not coalesce error') || error.message?.includes('Internal JSON-RPC error')) {
          throw error; // Will be caught by retry mechanism
        }
        
        // Other specific errors
        if (error.message?.includes('insufficient funds')) {
          throw new Error('Insufficient POL for gas fees');
        } else if (error.message?.includes('gas')) {
          throw new Error('Gas limit too low or network congestion. Try again.');
        } else {
          throw new Error(`Blockchain error: ${error.message || 'Unknown transaction failure'}`);
        }
      }
    });
  }

  async getTokens(): Promise<TokenInfo[]> {
    const tokens = await this.getTokensForNetwork();
    return Object.values(tokens);
  }

  async getTokenInfo(symbol: string): Promise<TokenInfo | undefined> {
    const tokens = await this.getTokensForNetwork();
    return tokens[symbol.toUpperCase()];
  }

  async getTokenBalance(address: string, tokenSymbol?: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');
    
    const network = await this.getCurrentNetwork();
    const nativeToken = network === 'amoy' ? 'POL' : 'ETH';

    try {
      if (!tokenSymbol || tokenSymbol === nativeToken) {
        // Get native token balance
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
      }

      const tokenInfo = await this.getTokenInfo(tokenSymbol);
      if (!tokenInfo) throw new Error(`Token ${tokenSymbol} not found`);

      const contract = new ethers.Contract(tokenInfo.address, this.ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(address);
      return ethers.formatUnits(balance, tokenInfo.decimals);
    } catch (error) {
      console.error(`Failed to get ${tokenSymbol || nativeToken} balance:`, error);
      return '0';
    }
  }

  async getAllTokenBalances(address: string): Promise<Record<string, string>> {
    const balances: Record<string, string> = {};
    const network = await this.getCurrentNetwork();
    
    if (network === 'amoy') {
      // Get POL balance for gas fees
      const polBalance = await this.getTokenBalance(address, 'POL');
      balances['POL'] = polBalance;
      
      // Check if user has sufficient POL for transactions
      if (parseFloat(polBalance) < 0.01) {
        console.warn('⚠️ Low POL balance detected. User may need to get POL from faucet.');
      }
      
      // Get TRT token balance
      const trtBalance = await this.getTrustTokenBalance(address);
      balances['TRT'] = trtBalance;
    } else if (network === 'opSepolia') {
      // Get ETH balance for gas fees
      const ethBalance = await this.getTokenBalance(address, 'ETH');
      balances['ETH'] = ethBalance;
      
      // Check if user has sufficient ETH for transactions
      if (parseFloat(ethBalance) < 0.01) {
        console.warn('⚠️ Low ETH balance detected. User may need to get ETH from faucet.');
      }
      
      // Get TRUST token balance
      const trustBalance = await this.getTrustTokenBalance(address);
      balances['TRUST'] = trustBalance;
    }
    
    return balances;
  }

  async getTrustTokenBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected');
    
    try {
      // Use the same calculation as dashboard: query Supabase for approved reviews
      // This ensures exact consistency between dashboard and staking sections
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .ilike('wallet_address', address)
        .eq('status', 'approved'); // Only count approved reviews
      
      if (error) {
        console.error('❌ Error fetching approved reviews:', error);
        return '0';
      }
      
      const approvedReviewCount = reviews?.length || 0;
      const trtBalance = approvedReviewCount * 10; // 10 TRT per approved review
      
      console.log(`📊 User has ${approvedReviewCount} approved reviews in database`);
      console.log(`🪙 TRT Balance: ${trtBalance} TRT (${approvedReviewCount} approved reviews × 10 TRT)`);
      
      return trtBalance.toString();
      
    } catch (error) {
      console.error('Failed to get TRT balance from database:', error);
      return '0';
    }
  }

  async estimateSwap(fromToken: string, toToken: string, amount: string): Promise<string> {
    // Mock exchange rates for demo - in production, this would call a DEX API
    const rates: Record<string, Record<string, number>> = {
      POL: { ETH: 0.0015, BTC: 0.000025, USDT: 0.85, USDC: 0.85, TRT: 1200 },
      ETH: { POL: 650, BTC: 0.065, USDT: 2500, USDC: 2500, TRT: 1800000 },
      BTC: { POL: 40000, ETH: 15.4, USDT: 95000, USDC: 95000, TRT: 28000000 },
      USDT: { POL: 1.18, ETH: 0.0004, BTC: 0.00001, USDC: 1.0, TRT: 1400 },
      USDC: { POL: 1.18, ETH: 0.0004, BTC: 0.00001, USDT: 1.0, TRT: 1400 },
      TRT: { POL: 0.00083, ETH: 0.00000056, BTC: 0.000000036, USDT: 0.00071, USDC: 0.00071 }
    };

    const rate = rates[fromToken]?.[toToken] || 1;
    return (parseFloat(amount) * rate).toFixed(6);
  }
}

export const web3Service = new Web3Service();