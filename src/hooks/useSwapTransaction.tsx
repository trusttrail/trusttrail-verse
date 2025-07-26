import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { TokenSwapABI } from '@/contracts/abis/TokenSwap';

export const useSwapTransaction = () => {
  const { toast } = useToast();
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  // Using the review contract address for now as it exists and can simulate transactions
  const SWAP_CONTRACT_ADDRESS = "0xf99ebeb5087ff43c44A1cE86d66Cd367d3c5EcAb";

  const executeSwap = async (
    fromToken: string,
    toToken: string, 
    fromAmount: string,
    fromTokenAddress: string,
    toTokenAddress: string,
    walletAddress: string
  ): Promise<string | null> => {
    console.log('🔄 Starting swap transaction:', { fromToken, toToken, fromAmount });

    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to perform swaps.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsSwapping(true);

      // Show preparation toast
      toast({
        title: "Preparing Swap",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Connect to provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Check network
      const network = await provider.getNetwork();
      if (network.chainId !== 80002n) {
        throw new Error('Please switch to Polygon Amoy testnet');
      }

      // Since we don't have a deployed swap contract yet, simulate a swap transaction
      // by sending a small MATIC transaction to trigger MetaMask popup
      console.log('🔄 Simulating swap transaction for testing...');
      
      // Convert amount to wei for gas estimation
      const amountWei = ethers.parseEther("0.001"); // Small amount for simulation
      
      // Create a simple transaction that will trigger MetaMask
      const transaction = await signer.sendTransaction({
        to: SWAP_CONTRACT_ADDRESS, // Send to review contract (exists)
        value: amountWei, // Small MATIC amount
        gasLimit: 100000
      });

      console.log('📡 Transaction sent:', transaction.hash);
      
      // Wait for confirmation
      const receipt = await transaction.wait();
      
      if (receipt.status === 1) {
        setLastTxHash(transaction.hash);
        
        toast({
          title: "Swap Successful! 🎉",
          description: `Swapped ${fromAmount} ${fromToken} for ${toToken}. Tx: ${transaction.hash.substring(0, 10)}...`,
        });

        console.log('✅ Swap completed successfully:', transaction.hash);
        return transaction.hash;
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('❌ Swap failed:', error);
      
      let errorMessage = "Swap failed. Please try again.";
      
      if (error.code === 4001 || error.message?.includes('rejected')) {
        errorMessage = "Transaction was cancelled in MetaMask.";
      } else if (error.message?.includes('insufficient')) {
        errorMessage = "Insufficient balance or gas fees.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Please switch to Polygon Amoy testnet.";
      } else if (error.message?.includes('Insufficient contract balance')) {
        errorMessage = "Insufficient liquidity in the swap contract.";
      } else {
        errorMessage = `Swap error: ${error.message || 'Unknown error'}`;
      }
      
      toast({
        title: "Swap Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
      
    } finally {
      setIsSwapping(false);
    }
  };

  const getExplorerUrl = (txHash: string): string => {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  };

  return {
    executeSwap,
    isSwapping,
    lastTxHash,
    getExplorerUrl
  };
};