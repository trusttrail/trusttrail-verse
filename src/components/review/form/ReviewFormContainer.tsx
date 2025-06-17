
import React from 'react';
import { useFormSubmission } from './useFormSubmission';
import { useFormValidation } from './useFormValidation';
import { useFormEventHandlers } from './useFormEventHandlers';
import { useGitcoinHandlers } from './useGitcoinHandlers';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuth } from '@/hooks/useAuth';
import ReviewFormContent from '../ReviewFormContent';

const ReviewFormContainer = () => {
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
    gitcoinVerified,
    resetForm,
    updateFormData,
    updateFiles,
    setGitcoinVerified,
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
    walletAddress, // Pass wallet address here
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
      gitcoinVerified={gitcoinVerified}
      isFormValid={isFormValid}
      isSubmitting={isSubmitting}
      isTransacting={isTransacting}
      isVerifying={isVerifying}
      isWalletConnected={isWalletConnected}
      walletAddress={walletAddress}
      needsSignup={needsSignup}
      existingUser={existingUser}
      updateFormData={updateFormData}
      updateFiles={updateFiles}
      onFormSubmit={onFormSubmit}
      handleVerifyGitcoin={handleVerifyGitcoin}
      handleCheckVerification={handleCheckVerification}
    />
  );
};

export default ReviewFormContainer;
