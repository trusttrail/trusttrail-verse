
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
      
      // Show fast AI screening toast
      toast({
        title: "🤖 AI Screening in Progress",
        description: "Fast AI analysis in progress... This should take less than 1 minute.",
      });
      
      const aiStartTime = Date.now();
      
      // Submit to database with fast AI screening (no more pending status)
      console.log('💾 Submitting to database with fast AI screening...');
      const dbResult = await submitReviewToDatabase(formData, walletAddress);
      
      const aiEndTime = Date.now();
      const aiProcessingTime = aiEndTime - aiStartTime;
      
      if (!dbResult.success) {
        toast({
          title: "Submission Failed",
          description: dbResult.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Database submission successful:', dbResult);
      
      // Show detailed AI screening results - now with immediate approval/rejection
      if (dbResult.aiScreeningResult?.approved) {
        toast({
          title: "🎉 Review Approved!",
          description: `AI screening completed in ${Math.round(aiProcessingTime/1000)}s. Confidence: ${dbResult.aiScreeningResult.confidence}%. Your review is now live!`,
          duration: 5000,
        });
      } else {
        toast({
          title: "❌ Review Rejected",
          description: `AI screening completed in ${Math.round(aiProcessingTime/1000)}s. Reason: ${dbResult.aiScreeningResult?.reasoning || 'Content did not meet quality standards'}`,
          variant: "destructive",
          duration: 5000,
        });
      }

      // Only try blockchain submission if review was approved
      if (dbResult.aiScreeningResult?.approved) {
        console.log('🔗 Attempting blockchain submission...');
        const txHash = await submitReviewTransaction(formData, walletAddress);
        
        if (txHash) {
          console.log('✅ Blockchain transaction successful:', txHash);
          
          toast({
            title: "💎 Blockchain Success!",
            description: "Review also secured on blockchain! You've earned 10 $TRUST tokens.",
            duration: 5000,
          });
        } else {
          console.log('❌ Blockchain transaction failed, but database save succeeded');
        }
      }
      
      // Reset form after successful submission (approved or rejected)
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
