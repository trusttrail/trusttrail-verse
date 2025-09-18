
import React from 'react';
import ReviewFormContainer from './form/ReviewFormContainer';
import { RewardDistributionInfo } from './RewardDistributionInfo';

interface WriteReviewFormProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: Array<{ id: string; name: string; icon?: string }>;
}

const WriteReviewForm = ({ isWalletConnected, connectWallet, categories }: WriteReviewFormProps) => {
  return (
    <div className="space-y-4">
      <RewardDistributionInfo />
      <ReviewFormContainer 
        categories={categories}
      />
    </div>
  );
};

export default WriteReviewForm;
