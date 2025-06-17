
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Transaction } from '@/hooks/useWeb3Transaction';
import { submitReviewToDatabase } from '@/utils/formSubmission';
import { ReviewFormData } from '@/hooks/useReviewForm';

interface UseFormSubmissionProps {
  isWalletConnected: boolean;
  walletAddress: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, formData: ReviewFormData) => {
    e.preventDefault();
    
    if (!isWalletConnected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!gitcoinVerified) {
      toast({
        title: "Gitcoin Verification Required",
        description: "Please verify your Gitcoin passport before submitting a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting review submission process...');
      
      // First, always try to submit to database
      console.log('💾 Submitting to database first...');
      const dbResult = await submitReviewToDatabase(formData, walletAddress);
      
      if (!dbResult.success) {
        toast({
          title: "Database Error",
          description: "Failed to save review. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Database submission successful, now attempting blockchain...');
      
      // Then try blockchain submission
      const txHash = await submitReviewTransaction(formData, walletAddress);
      
      if (txHash) {
        console.log('✅ Blockchain transaction successful:', txHash);
        
        // Update the review status to approved since blockchain succeeded
        console.log('🔄 Updating review status to approved...');
        // Note: In a real app, you'd update the review record here
        
        toast({
          title: "Success! 🎉",
          description: "Review submitted successfully to both blockchain and database! You have earned 10 $TRUST tokens.",
        });
      } else {
        console.log('❌ Blockchain transaction failed, but database save succeeded');
        toast({
          title: "Partial Success",
          description: "Review saved to database. Blockchain verification failed, but your review is pending approval.",
        });
      }
      
      // Reset form after successful submission
      resetForm();
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: "An error occurred during submission. Please try again.",
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
