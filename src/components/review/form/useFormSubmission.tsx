
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
      
      // Show AI screening toast
      toast({
        title: "AI Screening in Progress",
        description: "Your review is being analyzed for authenticity and quality...",
      });
      
      // Submit to database with AI screening
      console.log('💾 Submitting to database with AI screening...');
      const dbResult = await submitReviewToDatabase(formData, walletAddress);
      
      if (!dbResult.success) {
        toast({
          title: "Submission Failed",
          description: dbResult.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Database submission successful:', dbResult);
      
      // Show appropriate success message based on AI approval
      if (dbResult.aiScreeningResult?.approved) {
        toast({
          title: "Review Approved! 🎉",
          description: "Your review passed AI screening and has been automatically approved. It will appear in Recent Reviews!",
        });
      } else {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted but requires additional review before approval.",
        });
      }

      // Then try blockchain submission
      console.log('🔗 Attempting blockchain submission...');
      const txHash = await submitReviewTransaction(formData, walletAddress);
      
      if (txHash) {
        console.log('✅ Blockchain transaction successful:', txHash);
        
        toast({
          title: "Blockchain Success! 🎉",
          description: "Review also submitted to blockchain! You have earned 10 $TRUST tokens.",
        });
      } else {
        console.log('❌ Blockchain transaction failed, but database save succeeded');
        // Don't show error toast since database submission was successful
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
