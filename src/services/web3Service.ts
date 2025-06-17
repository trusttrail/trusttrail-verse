import { ethers } from 'ethers';
import { ReviewPlatformABI } from '../contracts/abis/ReviewPlatform';
import { RewardTokenABI } from '../contracts/abis/RewardToken';

// Contract addresses (updated with your deployed contracts)
export const CONTRACTS = {
  polygon: {
    reviewPlatform: '0x0000000000000000000000000000000000000000', // To be updated
    rewardToken: '0x0000000000000000000000000000000000000000', // To be updated
    chainId: 137, // Polygon Mainnet
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com/'
  },
  mumbai: {
    reviewPlatform: '0x0000000000000000000000000000000000000000', // To be updated
    rewardToken: '0x0000000000000000000000000000000000000000', // To be updated
    chainId: 80001, // Polygon Mumbai Testnet
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    explorerUrl: 'https://mumbai.polygonscan.com/'
  },
  amoy: {
    reviewPlatform: '0xf99ebeb5087ff43c44a1ce86d66cd367d3c5ecab', // Your deployed ReviewPlatform
    rewardToken: '0x186389f359713852366b4eA1eb9BC947f68F74ca', // Your deployed RewardToken
    chainId: 80002, // Polygon Amoy Testnet
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    explorerUrl: 'https://amoy.polygonscan.com/'
  }
};

export interface ReviewData {
  companyName: string;
  category: string;
  ipfsHash: string;
  proofIpfsHash: string;
  rating: number;
}

export interface ReviewResult {
  reviewId: number;
  reviewer: string;
  companyName: string;
  category: string;
  ipfsHash: string;
  proofIpfsHash: string;
  rating: number;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  status: number;
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private reviewContract: ethers.Contract | null = null;
  private tokenContract: ethers.Contract | null = null;
  private currentNetwork: keyof typeof CONTRACTS = 'amoy';

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        this.handleNetworkChange(parseInt(chainId, 16));
      });

      // Set initial network based on current chain
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        this.handleNetworkChange(parseInt(chainId, 16));
      } catch (error) {
        console.error('Failed to get current chain ID:', error);
      }
    }
  }

  private handleNetworkChange(chainId: number) {
    if (chainId === CONTRACTS.polygon.chainId) {
      this.currentNetwork = 'polygon';
    } else if (chainId === CONTRACTS.mumbai.chainId) {
      this.currentNetwork = 'mumbai';
    } else if (chainId === CONTRACTS.amoy.chainId) {
      this.currentNetwork = 'amoy';
    }
    this.initializeContracts();
  }

  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }

    try {
      await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();
      await this.initializeContracts();
      
      const address = await this.signer.getAddress();
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  private async initializeContracts() {
    if (!this.signer) return;

    const networkConfig = CONTRACTS[this.currentNetwork];
    
    // Only initialize contracts if addresses are not placeholder
    if (networkConfig.reviewPlatform !== '0x0000000000000000000000000000000000000000') {
      this.reviewContract = new ethers.Contract(
        networkConfig.reviewPlatform,
        ReviewPlatformABI,
        this.signer
      );
      
      console.log('🔗 Review contract initialized:', networkConfig.reviewPlatform);
      console.log('📋 Contract ABI functions:', ReviewPlatformABI.filter(item => item.type === 'function').map(f => f.name));
    }

    if (networkConfig.rewardToken !== '0x0000000000000000000000000000000000000000') {
      this.tokenContract = new ethers.Contract(
        networkConfig.rewardToken,
        RewardTokenABI,
        this.signer
      );
    }
  }

  async submitReview(reviewData: ReviewData): Promise<string> {
    console.log('🚀 Web3Service: Starting review submission');
    console.log('📊 Current network:', this.currentNetwork);
    console.log('📝 Review data:', reviewData);
    console.log('🏗️ Contract addresses:', CONTRACTS[this.currentNetwork]);

    // Validate network and contracts
    const networkConfig = CONTRACTS[this.currentNetwork];
    if (!this.provider || !this.signer) {
      console.error('❌ Provider or signer not available');
      throw new Error('Wallet not connected properly. Please reconnect your wallet.');
    }

    if (!this.reviewContract) {
      console.error('❌ Review contract not initialized');
      throw new Error('Review contract not initialized. Please switch to Amoy network.');
    }

    try {
      // Check wallet balance first
      const balance = await this.provider.getBalance(await this.signer.getAddress());
      console.log('💰 Wallet balance (MATIC):', ethers.formatEther(balance));
      
      if (balance === 0n) {
        throw new Error('Insufficient MATIC balance. Please get test MATIC from Polygon faucet.');
      }

      // Check current network
      const network = await this.provider.getNetwork();
      console.log('🌐 Current network chainId:', network.chainId);
      
      if (Number(network.chainId) !== networkConfig.chainId) {
        throw new Error(`Please switch to Polygon Amoy testnet (Chain ID: ${networkConfig.chainId})`);
      }

      // Validate rating is uint8 (0-255, but we want 1-5)
      const rating = Math.max(1, Math.min(5, Math.floor(reviewData.rating)));
      
      console.log('📋 Contract functions available:', Object.keys(this.reviewContract.interface.functions));
      console.log('📊 Submitting with parameters:', {
        companyName: reviewData.companyName,
        category: reviewData.category,
        ipfsHash: reviewData.ipfsHash,
        proofIpfsHash: reviewData.proofIpfsHash,
        rating: rating
      });

      // Estimate gas first
      console.log('⛽ Estimating gas for review submission...');
      
      try {
        const gasEstimate = await this.reviewContract.submitReview.estimateGas(
          reviewData.companyName,
          reviewData.category,
          reviewData.ipfsHash,
          reviewData.proofIpfsHash,
          rating
        );
        console.log('⛽ Gas estimate:', gasEstimate.toString());
      } catch (gasError: any) {
        console.error('❌ Gas estimation failed:', gasError);
        console.error('❌ Gas error details:', {
          reason: gasError.reason,
          code: gasError.code,
          method: gasError.method,
          transaction: gasError.transaction
        });
        
        // Check if it's a contract execution error
        if (gasError.reason) {
          throw new Error(`Contract error: ${gasError.reason}`);
        } else if (gasError.message?.includes('insufficient funds')) {
          throw new Error('Insufficient MATIC for gas fees. Please get test MATIC from faucet.');
        } else {
          throw new Error(`Gas estimation failed: ${gasError.message || 'Unknown error'}`);
        }
      }

      // Submit the review transaction
      console.log('📤 Submitting review transaction...');
      
      const tx = await this.reviewContract.submitReview(
        reviewData.companyName,
        reviewData.category,
        reviewData.ipfsHash,
        reviewData.proofIpfsHash,
        rating,
        {
          gasLimit: 300000, // Set a reasonable gas limit
        }
      );

      console.log('✅ Transaction submitted:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('🎉 Transaction confirmed:', receipt);
      
      return tx.hash;

    } catch (error: any) {
      console.error('❌ Review submission failed:', error);
      console.error('❌ Error details:', {
        code: error.code,
        method: error.method,
        reason: error.reason,
        info: error.info
      });
      
      // Enhanced error handling
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (error.code === -32603) {
        throw new Error('Internal JSON-RPC error. Please try again.');
      } else if (error.code === 'UNSUPPORTED_OPERATION') {
        throw new Error('Smart contract function not found. Please check contract deployment.');
      } else if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient MATIC for transaction fee. Get test MATIC from Polygon faucet.');
      } else if (error.message?.includes('execution reverted')) {
        throw new Error('Smart contract execution failed. Contract may need configuration.');
      } else if (error.message?.includes('nonce')) {
        throw new Error('Transaction nonce error. Please reset MetaMask account.');
      } else if (error.message?.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(error.message || 'Transaction failed. Please try again.');
      }
    }
  }

  async upvoteReview(reviewId: number): Promise<string> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const tx = await this.reviewContract.upvoteReview(reviewId);
      console.log('Upvote transaction:', tx.hash);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to upvote review:', error);
      throw new Error('Failed to upvote review');
    }
  }

  async downvoteReview(reviewId: number): Promise<string> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const tx = await this.reviewContract.downvoteReview(reviewId);
      console.log('Downvote transaction:', tx.hash);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to downvote review:', error);
      throw new Error('Failed to downvote review');
    }
  }

  async addComment(reviewId: number, content: string): Promise<string> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const tx = await this.reviewContract.addComment(reviewId, content);
      console.log('Comment transaction:', tx.hash);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  async getReview(reviewId: number): Promise<ReviewResult> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const review = await this.reviewContract.getReview(reviewId);
      return {
        reviewId,
        reviewer: review.reviewer,
        companyName: review.companyName,
        category: review.category,
        ipfsHash: review.ipfsHash,
        proofIpfsHash: review.proofIpfsHash,
        rating: review.rating,
        timestamp: review.timestamp.toNumber(),
        upvotes: review.upvotes.toNumber(),
        downvotes: review.downvotes.toNumber(),
        status: review.status
      };
    } catch (error) {
      console.error('Failed to get review:', error);
      throw new Error('Failed to get review from blockchain');
    }
  }

  async getUserReviews(address: string): Promise<number[]> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const reviewIds = await this.reviewContract.getUserReviews(address);
      return reviewIds.map((id: any) => id.toNumber());
    } catch (error) {
      console.error('Failed to get user reviews:', error);
      throw new Error('Failed to get user reviews');
    }
  }

  async getCompanyReviews(companyName: string): Promise<number[]> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const reviewIds = await this.reviewContract.getCompanyReviews(companyName);
      return reviewIds.map((id: any) => id.toNumber());
    } catch (error) {
      console.error('Failed to get company reviews:', error);
      throw new Error('Failed to get company reviews');
    }
  }

  async getTokenBalance(address: string): Promise<string> {
    if (!this.tokenContract) {
      return '0'; // Return 0 if token contract not available
    }

    try {
      const balance = await this.tokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return '0';
    }
  }

  getCurrentNetwork(): keyof typeof CONTRACTS {
    return this.currentNetwork;
  }

  getExplorerUrl(txHash: string): string {
    return `${CONTRACTS[this.currentNetwork].explorerUrl}tx/${txHash}`;
  }

  getContractAddresses() {
    return CONTRACTS[this.currentNetwork];
  }

  isContractsDeployed(): boolean {
    const networkConfig = CONTRACTS[this.currentNetwork];
    return networkConfig.reviewPlatform !== '0x0000000000000000000000000000000000000000';
  }
}

export const web3Service = new Web3Service();
