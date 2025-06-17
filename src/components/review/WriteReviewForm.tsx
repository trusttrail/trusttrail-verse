
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Transaction } from '@/hooks/useWeb3Transaction';
import { useTrustScore } from '@/hooks/useTrustScore';
import ReviewPrerequisites from './ReviewPrerequisites';
import ReviewFormContent from './ReviewFormContent';
import ReviewSubmissionSection from './ReviewSubmissionSection';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon?: string }>;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet, categories }: WriteReviewFormProps) => {
  const { isAuthenticated } = useAuth();
  const { needsSignup, existingUser, walletAddress } = useWalletConnection();
  const { 
    isVerified: gitcoinVerified, 
    passportScore, 
    needsRefresh,
    isVerifying,
    verifyPassport, 
    refreshPassportScore 
  } = useGitcoinPassport();
  const { toast } = useToast();
  const { submitReviewTransaction, isTransacting } = useWeb3Transaction();
  const { trustScoreData, updateTrustScore } = useTrustScore();
  
  const {
    formData,
    files,
    setFiles,
    fileError,
    setFileError,
    openCompanySelect,
    setOpenCompanySelect,
    filteredCompanies,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    resetForm,
  } = useReviewForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    await verifyPassport(walletAddress);
  };

  const handleRefreshGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    await refreshPassportScore(walletAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
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
      
      // Submit transaction to blockchain
      const txHash = await submitReviewTransaction(formData);
      
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

  // Debug form validation - log all conditions
  console.log('=== FORM VALIDATION DEBUG ===');
  console.log('formData.companyName:', formData.companyName);
  console.log('formData.category:', formData.category);
  console.log('formData.title:', formData.title);
  console.log('formData.review:', formData.review);
  console.log('formData.rating:', formData.rating);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('isWalletConnected:', isWalletConnected);
  console.log('existingUser:', existingUser);
  console.log('gitcoinVerified:', gitcoinVerified);
  console.log('files.length:', files.length);

  // Updated form validation logic - allow wallet-only users with Gitcoin verification
  const isEffectivelyAuthenticated = isAuthenticated || isWalletConnected;
  
  // Check all required fields are filled
  const allFieldsFilled = formData.companyName.trim() && 
                         formData.category.trim() && 
                         formData.title.trim() && 
                         formData.review.trim() && 
                         formData.rating > 0;

  // Final form validation - wallet + gitcoin verification is sufficient
  const isFormValid = allFieldsFilled && 
                     isWalletConnected && 
                     gitcoinVerified;

  console.log('allFieldsFilled:', allFieldsFilled);
  console.log('isEffectivelyAuthenticated:', isEffectivelyAuthenticated);
  console.log('Final isFormValid:', isFormValid);
  console.log('=== END FORM VALIDATION DEBUG ===');

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Write a Review</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Share your experience with the community. Your review will be verified on-chain and you'll earn $NOCAP tokens for contributing to the ecosystem.
        </p>
        {trustScoreData && (
          <div className="mt-4 flex justify-center">
            <Badge variant="secondary" className="px-3 py-1">
              Trust Score: {trustScoreData.score} ({trustScoreData.level})
            </Badge>
          </div>
        )}
      </div>

      {/* Prerequisites Section */}
      <ReviewPrerequisites
        isWalletConnected={isWalletConnected}
        connectWallet={connectWallet}
        isAuthenticated={isAuthenticated}
        existingUser={existingUser}
        gitcoinVerified={gitcoinVerified}
        passportScore={passportScore}
        needsRefresh={needsRefresh}
        isVerifying={isVerifying}
        handleVerifyGitcoin={handleVerifyGitcoin}
        handleRefreshGitcoin={handleRefreshGitcoin}
      />

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ReviewFormContent
          formData={formData}
          files={files}
          setFiles={setFiles}
          fileError={fileError}
          setFileError={setFileError}
          openCompanySelect={openCompanySelect}
          setOpenCompanySelect={setOpenCompanySelect}
          filteredCompanies={filteredCompanies}
          categories={categories}
          handleInputChange={handleInputChange}
          handleRatingChange={handleRatingChange}
          handleCategoryChange={handleCategoryChange}
          handleCompanyChange={handleCompanyChange}
          handleCompanySearch={handleCompanySearch}
          handleCompanySelect={handleCompanySelect}
        />

        <ReviewSubmissionSection
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          isTransacting={isTransacting}
          isVerifying={isVerifying}
          filesLength={files.length}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
};

export default WriteReviewForm;
