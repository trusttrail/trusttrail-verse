
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
      
      console.log('Starting Web3 transaction for review submission');
      console.log('Review data:', reviewData);
      console.log('Connected address:', address);
      console.log('Current network:', web3Service.getCurrentNetwork());
      
      // Check if contracts are deployed
      if (!web3Service.isContractsDeployed()) {
        toast({
          title: "Demo Mode",
          description: "Smart contracts not deployed yet. Creating a demo transaction to show MetaMask integration.",
        });
      } else {
        toast({
          title: "Preparing Transaction",
          description: "Please confirm the transaction in your MetaMask wallet...",
        });
      }

      // Prepare review data for blockchain
      const blockchainReviewData = {
        companyName: reviewData.companyName,
        category: reviewData.category,
        ipfsHash: `QmHash_${Date.now()}`, // Generate unique IPFS hash for demo
        proofIpfsHash: `QmProofHash_${Date.now()}`, // Generate unique proof IPFS hash for demo
        rating: reviewData.rating
      };

      console.log('Blockchain review data:', blockchainReviewData);

      // Submit review to smart contract (or demo transaction)
      const txHash = await web3Service.submitReview(blockchainReviewData);
      
      setLastTxHash(txHash);
      
      const isDemo = !web3Service.isContractsDeployed();
      
      toast({
        title: isDemo ? "Demo Transaction Successful! 🎉" : "Transaction Successful! 🎉",
        description: isDemo 
          ? `Demo transaction completed. In production, this would submit your review to the blockchain. Tx: ${txHash.substring(0, 10)}...`
          : `Review submitted to blockchain. Transaction: ${txHash.substring(0, 10)}...`,
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
      } else if (error.message?.includes('Smart contracts are not deployed')) {
        errorMessage = "Smart contracts not deployed. Please deploy contracts first.";
      } else if (error.message?.includes('user rejected')) {
        errorMessage = "Transaction was cancelled by user.";
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
