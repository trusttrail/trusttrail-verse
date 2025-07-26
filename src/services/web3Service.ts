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
      
      // STEP 2: Get signer and balance
      console.log('👤 STEP 2: Getting signer info...');
      const signerAddress = await this.signer.getAddress();
      const balance = await this.provider.getBalance(signerAddress);
      const balanceInMatic = ethers.formatEther(balance);
      
      console.log('👤 Signer address:', signerAddress);
      console.log('💰 Balance:', balanceInMatic, 'MATIC');
      
      if (parseFloat(balanceInMatic) < 0.001) {
        throw new Error(`Insufficient MATIC: ${balanceInMatic} MATIC. Get free MATIC from faucet.`);
      }

      // STEP 3: Contract verification
      console.log('📜 STEP 3: Contract verification...');
      const CONTRACT_ADDRESS = "0xf99ebeb5087ff43c44A1cE86d66Cd367d3c5EcAb";
      
      const contractCode = await this.provider.getCode(CONTRACT_ADDRESS);
      if (contractCode === '0x') {
        throw new Error('Contract not deployed at address');
      }
      console.log('✅ Contract verified at:', CONTRACT_ADDRESS);

      // STEP 4: Prepare transaction data using your EXACT successful pattern
      console.log('🔨 STEP 4: Preparing transaction using successful pattern...');
      
      const timestamp = Date.now();
      const ipfsHash = `QmHash_${timestamp}_${Math.random().toString(36).substring(7)}`;
      const proofHash = `QmProof_${timestamp}_${Math.random().toString(36).substring(7)}`;
      
      // Use EXACT successful transaction encoding
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const functionSelector = "0xe8678368"; // Your working submitReview selector
      
      const encodedParams = abiCoder.encode(
        ['string', 'string', 'string', 'string', 'uint8'],
        [
          reviewData.companyName,
          reviewData.category,
          ipfsHash,
          proofHash,
          reviewData.rating
        ]
      );
      
      const txData = functionSelector + encodedParams.slice(2);
      console.log('🔨 Transaction data prepared, length:', txData.length);

      // STEP 5: Get current nonce and gas price
      console.log('⚙️ STEP 5: Getting transaction parameters...');
      
      const nonce = await this.provider.getTransactionCount(signerAddress, 'pending');
      console.log('🔢 Nonce:', nonce);
      
      // Use simple gas price instead of complex fee structure
      const gasPrice = 50000000000n; // 50 gwei - fixed and high
      console.log('⛽ Using fixed gas price:', gasPrice.toString(), 'wei (50 gwei)');

      // STEP 6: Create transaction object exactly like your successful ones
      console.log('📋 STEP 6: Creating transaction object...');
      
      const txRequest = {
        to: CONTRACT_ADDRESS,
        data: txData,
        gasLimit: 1000000, // Very high gas limit
        gasPrice: gasPrice,
        nonce: nonce,
        value: 0,
        type: 0 // Legacy transaction type
      };
      
      console.log('📋 Final transaction request:', {
        to: txRequest.to,
        dataLength: txRequest.data.length,
        gasLimit: txRequest.gasLimit,
        gasPrice: txRequest.gasPrice.toString(),
        nonce: txRequest.nonce,
        type: txRequest.type
      });

      // STEP 7: Send transaction
      console.log('🚀 STEP 7: SENDING TRANSACTION - MetaMask should popup NOW...');
      console.log('🚀 ===============================================================');
      
      const tx = await this.signer.sendTransaction(txRequest);
      
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

      // STEP 8: Wait for confirmation
      console.log('⏳ STEP 8: Waiting for confirmation...');
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
        throw new Error('Insufficient MATIC for gas fees');
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
    
    // Ensure we have MATIC balance for gas fees
    const maticBalance = await this.getTokenBalance(address, 'MATIC');
    balances['MATIC'] = maticBalance;
    
    // Check if user has sufficient MATIC for transactions
    if (parseFloat(maticBalance) < 0.01) {
      console.warn('⚠️ Low MATIC balance detected. User may need to get MATIC from faucet.');
    }
    
    // Get TRUST token balance from review rewards
    const trustBalance = await this.getTrustTokenBalance(address);
    balances['TRUST'] = trustBalance;
    
    // Get other token balances (these are mock for testnet)
    for (const token of this.getTokens()) {
      if (token.symbol === 'MATIC' || token.symbol === 'TRUST') continue; // Already fetched
      
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