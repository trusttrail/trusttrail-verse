
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
    
    console.log('🚀 FORM SUBMISSION STARTED');
    console.log('📋 Form data:', formData);
    console.log('🔍 Validation checks:');
    console.log('  - isWalletConnected:', isWalletConnected);
    console.log('  - walletAddress:', walletAddress);
    console.log('  - gitcoinVerified:', gitcoinVerified);
    
    if (!isWalletConnected || !walletAddress) {
      console.error('❌ Wallet check failed');
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!gitcoinVerified) {
      console.error('❌ Gitcoin verification failed');
      toast({
        title: "Gitcoin Verification Required",
        description: "Please verify your Gitcoin passport before submitting a review.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ All validation checks passed, proceeding with submission...');

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting review submission: Blockchain FIRST, then AI screening...');
      
      // STEP 1: Blockchain transaction FIRST (user signs with wallet)
      toast({
        title: "💰 Preparing Blockchain Transaction",
        description: "Please approve the transaction in your MetaMask wallet to secure your review on-chain first.",
        duration: 4000,
      });
      
      console.log('🔗 Starting blockchain submission FIRST...');
      const txHash = await submitReviewTransaction(formData, walletAddress);
      
      if (!txHash) {
        toast({
          title: "Transaction Failed",
          description: "Blockchain transaction was cancelled or failed. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // STEP 2: Now do AI screening AFTER successful blockchain transaction
      toast({
        title: "🤖 Processing Review",
        description: `Transaction successful! Now running quick AI screening... Tx: ${txHash.substring(0, 10)}...`,
        duration: 3000,
      });
      
      const aiStartTime = Date.now();
      
      // Submit to database with AI screening AFTER blockchain success
      console.log('💾 Now submitting to database with AI screening...');
      const dbResult = await submitReviewToDatabase(formData, walletAddress, txHash);
      
      const aiEndTime = Date.now();
      const aiProcessingTime = aiEndTime - aiStartTime;
      
      if (!dbResult.success) {
        toast({
          title: "Database Error",
          description: "Review secured on blockchain but database save failed. Contact support.",
          variant: "destructive",
          duration: 8000,
        });
        return;
      }

      console.log('✅ Complete flow successful - blockchain then AI:', dbResult);
      
      // Show final results based on AI decision
      if (dbResult.aiScreeningResult?.approved) {
        toast({
          title: "🎉 Review LIVE!",
          description: `✅ Blockchain secured + AI approved in ${Math.round(aiProcessingTime/1000)}s! You've earned 10 $TRUST tokens. Review is now live!`,
          duration: 6000,
        });
      } else {
        toast({
          title: "⚠️ Review Under Review",
          description: `Blockchain transaction successful but AI flagged for manual review. You still earned tokens! Tx: ${txHash.substring(0, 10)}...`,
          duration: 8000,
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
