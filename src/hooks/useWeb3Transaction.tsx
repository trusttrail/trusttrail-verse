
import { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

export const useWeb3Transaction = () => {
  const { web3Service, isConnected, address } = useWeb3();
  const { toast } = useToast();
  const [isTransacting, setIsTransacting] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  const submitReviewTransaction = async (reviewData: any): Promise<string | null> => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsTransacting(true);
      
      toast({
        title: "Preparing Transaction",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      console.log('Starting Web3 transaction for review submission');
      
      // Prepare review data for blockchain
      const blockchainReviewData = {
        companyName: reviewData.companyName,
        category: reviewData.category,
        ipfsHash: 'QmHash123', // This would be actual IPFS hash in production
        proofIpfsHash: 'QmProofHash456', // This would be actual proof IPFS hash
        rating: reviewData.rating
      };

      // Submit review to smart contract
      const txHash = await web3Service.submitReview(blockchainReviewData);
      
      setLastTxHash(txHash);
      
      toast({
        title: "Transaction Successful! 🎉",
        description: `Review submitted to blockchain. Transaction: ${txHash.substring(0, 10)}...`,
      });

      console.log('Review transaction successful:', txHash);
      
      return txHash;
      
    } catch (error: any) {
      console.error('Transaction failed:', error);
      
      let errorMessage = "Transaction failed. Please try again.";
      
      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user.";
      } else if (error.code === -32603) {
        errorMessage = "Insufficient funds for gas fee.";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient POL for transaction fee.";
      }
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
      
    } finally {
      setIsTransacting(false);
    }
  };

  const getExplorerUrl = (txHash: string): string => {
    return web3Service.getExplorerUrl(txHash);
  };

  return {
    submitReviewTransaction,
    isTransacting,
    lastTxHash,
    getExplorerUrl,
    isConnected,
    address
  };
};
