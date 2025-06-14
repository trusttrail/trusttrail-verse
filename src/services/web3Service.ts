
import { ethers } from 'ethers';
import { ReviewPlatformABI } from '../contracts/abis/ReviewPlatform';
import { RewardTokenABI } from '../contracts/abis/RewardToken';

// Contract addresses (will be updated after deployment)
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
  private currentNetwork: keyof typeof CONTRACTS = 'mumbai';

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
    }
  }

  private handleNetworkChange(chainId: number) {
    if (chainId === CONTRACTS.polygon.chainId) {
      this.currentNetwork = 'polygon';
    } else if (chainId === CONTRACTS.mumbai.chainId) {
      this.currentNetwork = 'mumbai';
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
    
    this.reviewContract = new ethers.Contract(
      networkConfig.reviewPlatform,
      ReviewPlatformABI,
      this.signer
    );

    this.tokenContract = new ethers.Contract(
      networkConfig.rewardToken,
      RewardTokenABI,
      this.signer
    );
  }

  async submitReview(reviewData: ReviewData): Promise<string> {
    if (!this.reviewContract) {
      throw new Error('Review contract not initialized');
    }

    try {
      const tx = await this.reviewContract.submitReview(
        reviewData.companyName,
        reviewData.category,
        reviewData.ipfsHash,
        reviewData.proofIpfsHash,
        reviewData.rating
      );

      console.log('Review submission transaction:', tx.hash);
      await tx.wait();
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw new Error('Failed to submit review to blockchain');
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
      throw new Error('Token contract not initialized');
    }

    try {
      const balance = await this.tokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw new Error('Failed to get token balance');
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
}

export const web3Service = new Web3Service();
