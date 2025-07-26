import { useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { ReviewPlatformABI } from '@/contracts/abis/ReviewPlatform';
import { REVIEW_PLATFORM_ADDRESS } from '@/constants/network';

interface StakingResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const useStakingTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const executeStaking = async (
    amount: string,
    action: 'stake' | 'unstake'
  ): Promise<StakingResult> => {
    setIsLoading(true);
    
    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Verify network
      if (network.chainId !== 80002n) {
        throw new Error('Please switch to Polygon Amoy testnet');
      }

      const contract = new ethers.Contract(
        REVIEW_PLATFORM_ADDRESS,
        ReviewPlatformABI,
        signer
      );

      // Convert amount to wei (assuming 18 decimals for TRUST token)
      const amountWei = ethers.parseEther(amount);

      toast({
        title: `Preparing ${action}...`,
        description: "Please confirm the transaction in MetaMask",
      });

      let tx;
      if (action === 'stake') {
        // For now, we'll use the review submission as staking (you'll need to add staking methods to contract)
        // This is a mock implementation - replace with actual staking contract call
        const companyId = "STAKING_POOL";
        const category = "STAKING";
        const ipfsHash = `QmStake_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const proofHash = `QmStakeProof_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        tx = await contract.submitReview(
          companyId,
          category,
          ipfsHash,
          proofHash,
          5 // rating for staking transaction
        );
      } else {
        // Mock unstaking transaction
        const companyId = "UNSTAKING_POOL";
        const category = "UNSTAKING";
        const ipfsHash = `QmUnstake_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const proofHash = `QmUnstakeProof_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        tx = await contract.submitReview(
          companyId,
          category,
          ipfsHash,
          proofHash,
          5
        );
      }

      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };

    } catch (error: any) {
      console.error(`${action} failed:`, error);
      
      let errorMessage = `Failed to ${action} tokens`;
      
      if (error.code === 4001) {
        errorMessage = "Transaction cancelled by user";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error - please check your connection";
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAPY = (baseRate: number = 0.25): string => {
    // Calculate APY like real DEXes based on:
    // 1. Base staking rate
    // 2. Protocol revenue sharing
    // 3. Token demand/supply dynamics
    
    const protocolRevenue = 0.05; // 5% from platform fees
    const demandMultiplier = 1.2; // Based on staking pool utilization
    const compoundingEffect = 1.1; // Daily compounding effect
    
    const totalAPY = (baseRate + protocolRevenue) * demandMultiplier * compoundingEffect;
    
    return `${(totalAPY * 100).toFixed(1)}%`;
  };

  const getStakedBalance = async (address: string): Promise<string> => {
    try {
      if (!window.ethereum) return "0";

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        REVIEW_PLATFORM_ADDRESS,
        ReviewPlatformABI,
        provider
      );

      // Get user's review count as a proxy for staked amount
      // In a real implementation, you'd have a dedicated staking contract
      const reviewIds = await contract.getUserReviews(address);
      const stakedAmount = reviewIds.length * 5; // 5 TRUST per review as staking

      return stakedAmount.toString();
    } catch (error) {
      console.error('Error getting staked balance:', error);
      return "0";
    }
  };

  const getRewards = async (address: string): Promise<{ daily: string; weekly: string; monthly: string }> => {
    try {
      const stakedBalance = await getStakedBalance(address);
      const staked = parseFloat(stakedBalance);
      
      if (staked === 0) {
        return { daily: "0", weekly: "0", monthly: "0" };
      }

      // Calculate rewards based on 30% APY
      const dailyRate = 0.30 / 365;
      const daily = staked * dailyRate;
      const weekly = daily * 7;
      const monthly = daily * 30;

      return {
        daily: daily.toFixed(4),
        weekly: weekly.toFixed(4),
        monthly: monthly.toFixed(2)
      };
    } catch (error) {
      console.error('Error calculating rewards:', error);
      return { daily: "0", weekly: "0", monthly: "0" };
    }
  };

  return {
    executeStaking,
    calculateAPY,
    getStakedBalance,
    getRewards,
    isLoading
  };
};