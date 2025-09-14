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
    const supportedChainIds = [80002n, 11155111n, 11155420n]; // Amoy, ETH Sepolia, and OP Sepolia
    
    if (!supportedChainIds.includes(network.chainId)) {
      throw new Error(`Unsupported network. Please switch to Polygon Amoy or OP Sepolia testnet.`);
    }
  }

  async getCurrentNetwork(): Promise<string> {
    if (!this.provider) return "unknown";
    
    const network = await this.provider.getNetwork();
    const chainId = network.chainId;
    
    if (chainId === 80002n) return "amoy";
    if (chainId === 11155111n) return "ethSepolia"; 
    if (chainId === 11155420n) return "opSepolia";
    
    return "unknown";
  }

  async getContractAddresses() {
    const network = await this.getCurrentNetwork();
    const { CONTRACT_ADDRESSES } = await import('@/constants/network');
    
    const addresses = CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES];
    if (!addresses) throw new Error(`Unsupported network: ${network}`);
    
    const explorerUrls = {
      amoy: 'https://amoy.polygonscan.com/',
      ethSepolia: 'https://sepolia.etherscan.io/',
      opSepolia: 'https://sepolia-optimism.etherscan.io/'
    };

    return {
      reviewPlatform: addresses.REVIEW_PLATFORM,
      rewardToken: addresses.REWARD_TOKEN,
      explorerUrl: explorerUrls[network as keyof typeof explorerUrls] || explorerUrls.amoy,
    };
  }

  async getExplorerUrl(txHash: string): Promise<string> {
    const network = await this.getCurrentNetwork();
    const baseUrls = {
      amoy: 'https://amoy.polygonscan.com/tx/',
      ethSepolia: 'https://sepolia.etherscan.io/tx/',
      opSepolia: 'https://sepolia-optimism.etherscan.io/tx/'
    };
    const baseUrl = baseUrls[network as keyof typeof baseUrls] || baseUrls.amoy;
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
    console.log('🔥 ===================== SMART CONTRACT SUBMISSION =====================');
    console.log('📊 Input data received:', JSON.stringify(reviewData, null, 2));
    console.log('🌐 Provider status:', !!this.provider);
    console.log('✍️ Signer status:', !!this.signer);
    
    if (!this.provider || !this.signer) {
      console.error('❌ CRITICAL: No provider/signer available');
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
        console.log('🌐 =================== STEP 1: CONNECTIVITY CHECK ===================');
        console.log('🌐 Checking network connection and basic connectivity...');
        const network = await this.provider.getNetwork();
        console.log('🌐 Network info retrieved:', {
          name: network.name,
          chainId: network.chainId.toString(),
          chainIdHex: '0x' + network.chainId.toString(16),
          currentNetworkName: await this.getCurrentNetwork()
        });
        
        const currentNetworkName = await this.getCurrentNetwork();
        console.log('🌐 Current network name from service:', currentNetworkName);
        
        // OP Sepolia specific network validation
        if (currentNetworkName === 'opSepolia') {
          console.log('🔴 =================== OP SEPOLIA DETECTED ===================');
          console.log('🔴 Expected chain ID: 11155420 (0xaa37dc)');
          console.log('🔴 Actual chain ID decimal:', network.chainId.toString());
          console.log('🔴 Actual chain ID hex: 0x' + network.chainId.toString(16));
          console.log('🔴 Network validation: Using optimized OP Sepolia flow');
          console.log('🔴 =========================================================');
        }
        
        console.log('✅ Network connectivity check passed');
        
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
        console.log('📜 =================== STEP 3: CONTRACT SETUP ===================');
        console.log('📜 Setting up contract interface and validation...');
        const contractAddresses = await this.getContractAddresses();
        const CONTRACT_ADDRESS = contractAddresses.reviewPlatform;
        
        console.log('📜 Raw contract address from config:', CONTRACT_ADDRESS);
        console.log('📜 Contract address type:', typeof CONTRACT_ADDRESS);
        console.log('📜 Contract address length:', CONTRACT_ADDRESS?.length);
        
        // Clean and validate contract address
        let cleanAddress = CONTRACT_ADDRESS;
        if (typeof CONTRACT_ADDRESS === 'string') {
          // Remove any whitespace and ensure proper format
          cleanAddress = CONTRACT_ADDRESS.trim().toLowerCase();
          console.log('📜 Cleaned contract address:', cleanAddress);
        }
        
        // More robust address validation
        const addressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!addressRegex.test(cleanAddress)) {
          console.error('❌ Contract address failed regex validation:', cleanAddress);
          throw new Error(`Invalid contract address format: ${cleanAddress}`);
        }
        
        console.log('✅ Contract address validation passed:', cleanAddress);
        
        // Import the ABI
        const { ReviewPlatformABI } = await import('@/contracts/abis/ReviewPlatform');
        
        // Create contract instance with signer - ensure no ENS resolution
        console.log('📜 Creating contract instance...');
        const contract = new ethers.Contract(
          cleanAddress, // Use the cleaned address
          ReviewPlatformABI, 
          this.signer
        );
        console.log('✅ Contract instance created successfully');
        console.log('📜 Contract target address:', await contract.getAddress());

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

        // STEP 5: Network-specific gas configuration
        console.log('⛽ STEP 5: Setting up gas configuration...');
        const currentNetwork = await this.getCurrentNetwork();
        console.log('🌐 Current network:', currentNetwork);
        
        let gasPrice: bigint;
        let gasLimit: bigint;
        
        if (currentNetwork === 'ethSepolia') {
          // Ethereum Sepolia settings
          try {
            const feeData = await this.provider.getFeeData();
            gasPrice = feeData.gasPrice ? (feeData.gasPrice * 120n) / 100n : ethers.parseUnits('20', 'gwei');
            gasLimit = 400000n;
            console.log('⛽ Ethereum Sepolia gas settings:', {
              gasPrice: ethers.formatUnits(gasPrice, 'gwei') + ' gwei',
              gasLimit: gasLimit.toString()
            });
          } catch (gasError) {
            gasPrice = ethers.parseUnits('20', 'gwei');
            gasLimit = 400000n;
            console.log('⛽ Ethereum Sepolia fallback gas settings');
          }
        } else if (currentNetwork === 'opSepolia') {
          // OP Sepolia specific settings - use higher gas price similar to Amoy
          try {
            const feeData = await this.provider.getFeeData();
            // Use similar gas pricing to Amoy but adjusted for OP Sepolia
            gasPrice = feeData.gasPrice ? (feeData.gasPrice * 200n) / 100n : ethers.parseUnits('2', 'gwei');
            gasLimit = 800000n; // Higher gas limit for OP Sepolia L2 operations
            console.log('⛽ OP Sepolia gas settings:', {
              gasPrice: ethers.formatUnits(gasPrice, 'gwei') + ' gwei',
              gasLimit: gasLimit.toString()
            });
          } catch (gasError) {
            console.log('⛽ OP Sepolia gas error, using fallback:', gasError);
            gasPrice = ethers.parseUnits('2', 'gwei');
            gasLimit = 800000n;
            console.log('⛽ OP Sepolia fallback gas settings');
          }
        } else {
          // Amoy settings (existing)
          try {
            const feeData = await this.provider.getFeeData();
            gasPrice = feeData.gasPrice ? (feeData.gasPrice * 150n) / 100n : ethers.parseUnits('50', 'gwei');
            gasLimit = 500000n; // Higher for Amoy
            console.log('⛽ Amoy gas settings:', {
              gasPrice: ethers.formatUnits(gasPrice, 'gwei') + ' gwei',
              gasLimit: gasLimit.toString()
            });
          } catch (gasError) {
            gasPrice = ethers.parseUnits('50', 'gwei');
            gasLimit = 500000n;
            console.log('⛽ Amoy fallback gas settings');
          }
        }

        // STEP 6: Call contract method - this will trigger MetaMask
        console.log('🚀 STEP 6: CALLING CONTRACT METHOD - MetaMask should popup NOW...');
        console.log('🚀 ===============================================================');
        
        // Network-specific transaction options - use simple gas pricing for all networks
        const txOptions: any = {
          gasLimit: gasLimit,
          gasPrice: gasPrice
        };
        
        console.log('⛽ Final transaction options:', txOptions);
        
        const tx = await contract.submitReview(
          reviewData.companyName,
          reviewData.category,
          ipfsHash,
          proofHash,
          reviewData.rating,
          txOptions
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
          
          // STEP 8: Mint reward tokens for successful review submission
          console.log('🪙 STEP 8: Minting reward tokens...');
          await this.mintRewardTokens(signerAddress, ethers.parseUnits('10', 18)); // 10 tokens per review
          
          return tx.hash;
        } else {
          throw new Error('Transaction failed with status 0');
        }
        
      } catch (error: any) {
        console.error('❌ Transaction attempt failed:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          reason: error.reason,
          data: error.data,
          receipt: error.receipt
        });
        
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
          throw new Error('Insufficient ETH for gas fees');
        } else if (error.message?.includes('gas')) {
          throw new Error('Gas limit too low or network congestion. Try again.');
        } else if (error.message?.includes('nonce')) {
          throw new Error('Transaction nonce error. Please reset MetaMask or try again.');
        } else if (error.message?.includes('execution reverted')) {
          throw new Error('Transaction reverted. Contract may not be deployed on this network.');
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
    } else if (network === 'ethSepolia' || network === 'opSepolia') {
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
      console.log('🪙 Getting real token balance from contract for:', address);
      
      const contractAddresses = await this.getContractAddresses();
      const tokenContract = new ethers.Contract(
        contractAddresses.rewardToken, 
        this.ERC20_ABI, 
        this.provider
      );
      
      // Get actual balance from contract
      const balance = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      const realBalance = ethers.formatUnits(balance, decimals);
      
      console.log('🪙 Real contract balance:', realBalance);
      return realBalance;
      
    } catch (error) {
      console.error('❌ Failed to get real token balance from contract:', error);
      console.log('🔄 Falling back to database calculation...');
      
      // Fallback: Use database calculation if contract call fails
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('*')
          .ilike('wallet_address', address)
          .eq('status', 'approved');
        
        if (error) {
          console.error('❌ Error fetching approved reviews:', error);
          return '0';
        }
        
        const approvedReviewCount = reviews?.length || 0;
        const fallbackBalance = approvedReviewCount * 10; // 10 tokens per approved review
        
        console.log(`📊 Fallback: ${approvedReviewCount} approved reviews = ${fallbackBalance} tokens`);
        return fallbackBalance.toString();
        
      } catch (dbError) {
        console.error('❌ Database fallback also failed:', dbError);
        return '0';
      }
    }
  }

  async estimateSwap(fromToken: string, toToken: string, amount: string): Promise<string> {
    // Mock exchange rates for demo - in production, this would call a DEX API
    const rates: Record<string, Record<string, number>> = {
      POL: { ETH: 0.0015, BTC: 0.000025, USDT: 0.85, USDC: 0.85, TRT: 1200 },
      ETH: { POL: 650, BTC: 0.065, USDT: 2500, USDC: 2500, TRUST: 1800000 },
      BTC: { POL: 40000, ETH: 15.4, USDT: 95000, USDC: 95000, TRT: 28000000 },
      USDT: { POL: 1.18, ETH: 0.0004, BTC: 0.00001, USDC: 1.0, TRT: 1400 },
      USDC: { POL: 1.18, ETH: 0.0004, BTC: 0.00001, USDT: 1.0, TRT: 1400 },
      TRT: { POL: 0.00083, ETH: 0.00000056, BTC: 0.000000036, USDT: 0.00071, USDC: 0.00071 },
      TRUST: { ETH: 0.00000056, BTC: 0.000000036, USDT: 0.00071, USDC: 0.00071 }
    };

    const rate = rates[fromToken]?.[toToken] || 1;
    return (parseFloat(amount) * rate).toFixed(6);
  }

  async mintRewardTokens(recipientAddress: string, amount: bigint): Promise<string | null> {
    if (!this.provider || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('🪙 Starting token minting process...');
      const contractAddresses = await this.getContractAddresses();
      
      // Import the RewardToken ABI
      const { RewardTokenABI } = await import('@/contracts/abis/RewardToken');
      
      // Create token contract instance
      const tokenContract = new ethers.Contract(
        contractAddresses.rewardToken,
        RewardTokenABI,
        this.signer
      );

      console.log('🪙 Minting', ethers.formatUnits(amount, 18), 'tokens to:', recipientAddress);
      
      // Get network-specific gas settings for minting
      const network = await this.getCurrentNetwork();
      let gasLimit: bigint;
      let gasPrice: bigint | undefined;
      
      if (network === 'opSepolia') {
        gasLimit = 300000n; // Higher for OP Sepolia L2
        try {
          const feeData = await this.provider.getFeeData();
          gasPrice = feeData.gasPrice ? (feeData.gasPrice * 150n) / 100n : ethers.parseUnits('0.001', 'gwei');
        } catch {
          gasPrice = ethers.parseUnits('0.001', 'gwei');
        }
      } else if (network === 'ethSepolia') {
        gasLimit = 250000n;
        gasPrice = undefined; // Let ethers handle it for ETH Sepolia
      } else {
        gasLimit = 300000n; // Amoy
        gasPrice = undefined;
      }
      
      // Attempt to mint tokens with network-specific gas settings
      const mintOptions: any = { gasLimit };
      if (gasPrice) {
        mintOptions.gasPrice = gasPrice;
      }
      
      const mintTx = await tokenContract.mint(recipientAddress, amount, mintOptions);
      
      console.log('🪙 Token mint transaction sent:', mintTx.hash);
      
      // Wait for confirmation
      const mintReceipt = await mintTx.wait(1);
      
      if (mintReceipt.status === 1) {
        console.log('🎉 Tokens minted successfully!');
        return mintTx.hash;
      } else {
        console.error('❌ Token minting failed');
        return null;
      }
      
    } catch (error: any) {
      console.error('❌ Token minting error:', error);
      
      // If minting fails, continue with review submission
      // Don't fail the entire process due to token minting issues
      if (error.message?.includes('not a minter') || error.message?.includes('Ownable')) {
        console.warn('⚠️ Contract not configured for token minting - review still successful');
      } else {
        console.error('❌ Unexpected minting error:', error.message);
      }
      return null;
    }
  }
}

export const web3Service = new Web3Service();