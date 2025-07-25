
import React from 'react';
import { useFormSubmission } from './useFormSubmission';
import { useFormValidation } from './useFormValidation';
import { useFormEventHandlers } from './useFormEventHandlers';
import { useGitcoinHandlers } from './useGitcoinHandlers';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuth } from '@/hooks/useAuth';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
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
    existingUser,
    connectWallet
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
    gitcoinVerified: localGitcoinVerified,
    setGitcoinVerified,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    resetForm,
  } = useReviewForm();

  // Use the actual Gitcoin passport hook for proper verification status
  const { isVerified: gitcoinPassportVerified } = useGitcoinPassport();
  
  // Use the passport hook's verification status as the source of truth
  const gitcoinVerified = gitcoinPassportVerified || localGitcoinVerified;

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

  // Enhanced debug logging to track all form state changes
  console.log('ReviewFormContainer State:', {
    formData,
    categoriesProvided: categories?.length || 0,
    categoryOptions: categories?.map(c => ({ id: c.id, name: c.name })) || [],
    isFormValid,
    isWalletConnected,
    walletAddress,
    gitcoinVerified,
    needsSignup,
    existingUser,
    isAuthenticated
  });

  // Validate that categories are properly formatted
  if (!categories || categories.length === 0) {
    console.error('No categories provided to ReviewFormContainer');
    return (
      <div className="p-4 border border-destructive rounded-md">
        <p className="text-destructive">Error: No categories available. Please refresh the page.</p>
      </div>
    );
  }

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
      connectWallet={connectWallet}
    />
  );
};

export default ReviewFormContainer;
