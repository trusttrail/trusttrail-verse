
import React from "react";
import WriteReviewForm from "@/components/review/WriteReviewForm";

interface WriteReviewTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: any[];
}

const WriteReviewTab = ({ isWalletConnected, connectWallet, categories }: WriteReviewTabProps) => (
  <WriteReviewForm
    isWalletConnected={isWalletConnected}
    connectWallet={connectWallet}
    categories={categories}
  />
);

export default WriteReviewTab;
