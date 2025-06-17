
import React from 'react';
import { useFormSubmission } from './useFormSubmission';
import { useFormValidation } from './useFormValidation';
import { useFormEventHandlers } from './useFormEventHandlers';
import { useGitcoinHandlers } from './useGitcoinHandlers';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuth } from '@/hooks/useAuth';
import ReviewFormContent from '../ReviewFormContent';

interface ReviewFormContainerProps {
  categories: Array<{ id: string; name: string; icon?: string }>;
}

const ReviewFormContainer = ({ categories }: ReviewFormContainerProps) => {
  const { isAuthenticated } = useAuth();
  const { 
    isWalletConnected, 
    walletAddress, 
    needsSignup, 
    existingUser 
  } = useWalletConnection();
  
  const {
    formData,
    files,
    setFiles,
    fileError,
    setFileError,
    openCompanySelect,
    setOpenCompanySelect,
    filteredCompanies,
    gitcoinVerified,
    setGitcoinVerified,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    resetForm,
  } = useReviewForm();

  const { isFormValid } = useFormValidation({
    formData,
    files,
    isAuthenticated,
    isWalletConnected,
    existingUser,
    gitcoinVerified,
  });

  const { handleSubmit, isSubmitting, isTransacting } = useFormSubmission({
    isWalletConnected,
    walletAddress,
    gitcoinVerified,
    resetForm,
  });

  const { onFormSubmit } = useFormEventHandlers({
    handleSubmit,
    formData,
  });

  const { handleVerifyGitcoin, handleCheckVerification, isVerifying } = useGitcoinHandlers({
    walletAddress,
    setGitcoinVerified,
  });

  return (
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
      gitcoinVerified={gitcoinVerified}
      isFormValid={isFormValid}
      isSubmitting={isSubmitting}
      isTransacting={isTransacting}
      isVerifying={isVerifying}
      isWalletConnected={isWalletConnected}
      walletAddress={walletAddress}
      needsSignup={needsSignup}
      existingUser={existingUser}
      handleInputChange={handleInputChange}
      handleRatingChange={handleRatingChange}
      handleCategoryChange={handleCategoryChange}
      handleCompanyChange={handleCompanyChange}
      handleCompanySearch={handleCompanySearch}
      handleCompanySelect={handleCompanySelect}
      onFormSubmit={onFormSubmit}
      handleVerifyGitcoin={handleVerifyGitcoin}
      handleCheckVerification={handleCheckVerification}
    />
  );
};

export default ReviewFormContainer;
