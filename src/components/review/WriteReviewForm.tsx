
import React from 'react';
import ReviewFormContainer from './form/ReviewFormContainer';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon?: string }>;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet, categories }: WriteReviewFormProps) => {
  return (
    <ReviewFormContainer />
  );
};

export default WriteReviewForm;
