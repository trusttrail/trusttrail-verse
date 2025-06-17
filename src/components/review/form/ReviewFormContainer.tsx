
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useTrustScore } from '@/hooks/useTrustScore';
import { useFormValidation } from './useFormValidation';
import { useFormSubmission } from './useFormSubmission';
import { useGitcoinHandlers } from './useGitcoinHandlers';
import { useFormEventHandlers } from './useFormEventHandlers';
import { useFormDebugLogger } from '@/hooks/useFormDebugLogger';
import ReviewPrerequisites from '../ReviewPrerequisites';
import ReviewFormContent from '../ReviewFormContent';
import ReviewSubmissionSection from '../ReviewSubmissionSection';

interface ReviewFormContainerProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon?: string }>;
}

const ReviewFormContainer = ({ isWalletConnected, connectWallet, categories }: ReviewFormContainerProps) => {
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
  const { trustScoreData } = useTrustScore();
  
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

  const { isEffectivelyAuthenticated, allFieldsFilled, isFormValid } = useFormValidation({
    formData,
    files,
    isAuthenticated,
    isWalletConnected,
    existingUser,
    gitcoinVerified,
  });

  const { handleSubmit, isSubmitting, isTransacting } = useFormSubmission({
    isWalletConnected,
    gitcoinVerified,
    resetForm,
  });

  const { handleVerifyGitcoin, handleRefreshGitcoin } = useGitcoinHandlers({
    walletAddress,
    verifyPassport,
    refreshPassportScore,
  });

  const { onFormSubmit } = useFormEventHandlers({
    handleSubmit,
    formData,
  });

  // Debug logging
  useFormDebugLogger({
    formData,
    files,
    isAuthenticated,
    isWalletConnected,
    existingUser,
    gitcoinVerified,
    allFieldsFilled,
    isEffectivelyAuthenticated,
    isFormValid,
  });

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
      <form onSubmit={onFormSubmit} className="space-y-6">
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
          onSubmit={onFormSubmit}
        />
      </form>
    </div>
  );
};

export default ReviewFormContainer;
