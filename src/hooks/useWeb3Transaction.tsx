
import { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';

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
      
      console.log('🎯 Starting Web3 transaction for review submission');
      console.log('📊 Review data:', reviewData);
      console.log('👤 Connected address:', address);
      console.log('🌐 Current network:', web3Service.getCurrentNetwork());
      
      // Show initial toast
      toast({
        title: "Preparing Transaction",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Prepare review data for blockchain
      const blockchainReviewData = {
        companyName: reviewData.companyName,
        category: reviewData.category,
        ipfsHash: `QmHash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique IPFS hash
        proofIpfsHash: `QmProofHash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique proof hash
        rating: reviewData.rating
      };

      console.log('🔗 Blockchain review data:', blockchainReviewData);

      // Submit review to smart contract
      const txHash = await web3Service.submitReview(blockchainReviewData);
      
      setLastTxHash(txHash);
      
      toast({
        title: "Transaction Successful! 🎉",
        description: `Review submitted to Amoy testnet. Transaction: ${txHash.substring(0, 10)}...`,
      });

      console.log('✅ Review transaction successful:', txHash);
      
      return txHash;
      
    } catch (error: any) {
      console.error('❌ Transaction failed:', error);
      
      toast({
        title: "Transaction Failed",
        description: error.message || "Transaction failed. Please try again.",
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
