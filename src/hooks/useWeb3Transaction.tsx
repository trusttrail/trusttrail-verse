
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { web3Service } from '@/services/web3Service';

export const useWeb3Transaction = () => {
  const { toast } = useToast();
  const [isTransacting, setIsTransacting] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  const submitReviewTransaction = async (reviewData: any, walletAddress?: string): Promise<string | null> => {
    console.log('🎯 ================ STARTING TRANSACTION PROCESS ================');
    console.log('📊 Review data received:', reviewData);
    console.log('👤 Wallet address:', walletAddress);
    console.log('🔍 MetaMask available:', !!window.ethereum);
    console.log('🔍 MetaMask isMetaMask:', window.ethereum?.isMetaMask);
    console.log('🌐 Current URL:', window.location.href);

    // Check if we have wallet address from the calling component
    if (!walletAddress) {
      console.error('❌ No wallet address provided');
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return null;
    }

    // Check if MetaMask is available
    if (!window.ethereum) {
      console.error('❌ MetaMask not detected');
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to submit reviews to blockchain.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsTransacting(true);
      
      console.log('🎯 Starting Web3 transaction for review submission');
      console.log('📊 Review data:', reviewData);
      console.log('👤 Connected address:', walletAddress);
      console.log('🌐 Network check - Getting current network...');
      
      // Check current network before proceeding
      try {
        const currentAccounts = await window.ethereum.request({ method: 'eth_accounts' });
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('🌐 Current accounts:', currentAccounts);
        console.log('🌐 Current chain ID:', currentChainId);
        console.log('🌐 Expected OP Sepolia chain ID: 0xaa37dc');
        
        if (currentChainId !== '0xaa37dc') {
          console.warn('⚠️ Not on OP Sepolia network. Current:', currentChainId);
        }
      } catch (networkError) {
        console.error('❌ Network check failed:', networkError);
      }
      
      // Show initial toast
      toast({
        title: "Preparing Transaction",
        description: "Please approve the transaction in your MetaMask wallet...",
      });

      // Force reconnection to ensure fresh web3 connection
      console.log('🔄 Ensuring fresh web3 connection...');
      try {
        // Request accounts to wake up MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('📱 Available accounts:', accounts);
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts available in MetaMask');
        }

        // Connect web3Service with fresh connection
        console.log('🔗 Connecting web3Service...');
        const connectedAddress = await web3Service.connect();
        console.log('✅ Web3Service connected to:', connectedAddress);

      } catch (connectionError) {
        console.error('❌ Web3 connection failed:', connectionError);
        throw new Error(`Connection failed: ${connectionError.message}`);
      }

      // Prepare review data for blockchain
      const blockchainReviewData = {
        companyName: reviewData.companyName,
        category: reviewData.category,
        title: reviewData.title,
        content: reviewData.review.substring(0, 100), // Limit for blockchain
        rating: reviewData.rating,
        timestamp: Date.now(),
        reviewer: walletAddress
      };

      console.log('🔗 Final blockchain review data:', blockchainReviewData);

      // Submit review to smart contract - THIS SHOULD TRIGGER METAMASK POPUP
      console.log('🚀 Calling web3Service.submitReview() - MetaMask should popup now...');
      console.log('📋 About to submit this data to blockchain:', blockchainReviewData);
      const txHash = await web3Service.submitReview(blockchainReviewData);
      
      console.log('✅ Transaction hash received:', txHash);
      setLastTxHash(txHash);
      
      toast({
        title: "Transaction Successful! 🎉",
        description: `Review submitted to blockchain. Tx: ${txHash.substring(0, 10)}...`,
      });

      console.log('✅ Review transaction completed successfully:', txHash);
      
      return txHash;
      
    } catch (error: any) {
      console.error('❌ Transaction failed with error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      });
      
      let errorMessage = "Transaction failed. Please try again.";
      
      // Specific error handling
      if (error.message?.includes('rejected') || error.code === 4001) {
        errorMessage = "Transaction was cancelled in MetaMask.";
      } else if (error.message?.includes('insufficient')) {
        errorMessage = "Insufficient gas balance. Get some from the faucet.";
      } else if (error.message?.includes('Connection failed')) {
        errorMessage = error.message;
      } else if (error.message?.includes('RPC Error') || error.message?.includes('Network connectivity issue')) {
        errorMessage = "RPC connection issues. Please refresh the page and try again.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection to supported testnet.";
      } else {
        errorMessage = `Transaction error: ${error.message || 'Unknown error'}`;
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

  const getExplorerUrl = async (txHash: string): Promise<string> => {
    return await web3Service.getExplorerUrl(txHash);
  };

  return {
    submitReviewTransaction,
    isTransacting,
    lastTxHash,
    getExplorerUrl
  };
};
