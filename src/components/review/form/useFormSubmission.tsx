
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

  const handleSubmit = async (formData: ReviewFormData) => {
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
      
      // Submit to blockchain first
      const txHash = await submitReviewTransaction(formData, walletAddress);
      
      if (txHash) {
        console.log('✅ Blockchain transaction successful:', txHash);
        
        // Submit to database with transaction hash
        const dbResult = await submitReviewToDatabase(formData, walletAddress, txHash);
        
        if (dbResult.success) {
          toast({
            title: "Success! 🎉",
            description: dbResult.message,
          });
          
          // Reset form after successful submission
          resetForm();
        } else {
          toast({
            title: "Partial Success",
            description: "Blockchain transaction successful, but database save failed. Your review is recorded on-chain.",
            variant: "destructive",
          });
        }
      } else {
        // If blockchain submission failed, still save to database as pending
        console.log('❌ Blockchain transaction failed, saving to database as pending...');
        
        const dbResult = await submitReviewToDatabase(formData, walletAddress);
        
        if (dbResult.success) {
          toast({
            title: "Review Saved",
            description: "Review saved for manual approval. Blockchain verification failed.",
          });
          resetForm();
        } else {
          toast({
            title: "Submission Failed",
            description: "Both blockchain and database submission failed. Please try again.",
            variant: "destructive",
          });
        }
      }
      
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
