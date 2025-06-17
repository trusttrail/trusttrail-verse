
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Transaction } from '@/hooks/useWeb3Transaction';
import { useTrustScore } from '@/hooks/useTrustScore';
import { ReviewFormData } from '@/hooks/useReviewForm';

interface UseFormSubmissionProps {
  isWalletConnected: boolean;
  walletAddress: string; // Add wallet address prop
  gitcoinVerified: boolean;
  resetForm: () => void;
}

export const useFormSubmission = ({
  isWalletConnected,
  walletAddress,
  gitcoinVerified,
  resetForm,
}: UseFormSubmissionProps) => {
  const { toast } = useToast();
  const { submitReviewTransaction, isTransacting } = useWeb3Transaction();
  const { updateTrustScore } = useTrustScore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, formData: ReviewFormData) => {
    e.preventDefault();
    
    if (!isWalletConnected || !walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!gitcoinVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your identity with Gitcoin Passport first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('🚀 Starting form submission with wallet:', walletAddress);
      
      // Submit transaction to blockchain with wallet address
      const txHash = await submitReviewTransaction(formData, walletAddress);
      
      if (txHash) {
        // Update trust score for successful review submission
        updateTrustScore('quality', 1);
        
        toast({
          title: "Review Submitted Successfully! 🎉",
          description: "Your review has been submitted to the blockchain and you've earned $NOCAP tokens!",
        });

        // Reset form
        resetForm();
      }
      
    } catch (error) {
      console.error('Review submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    isTransacting,
  };
};
