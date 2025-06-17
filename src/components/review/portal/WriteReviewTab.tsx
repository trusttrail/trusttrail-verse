
import React from "react";
import WriteReviewForm from "@/components/review/WriteReviewForm";

interface WriteReviewTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  categories: any[];
}

const WriteReviewTab = ({ isWalletConnected, connectWallet, categories }: WriteReviewTabProps) => {
  return (
    <div className="w-full">
      <WriteReviewForm
        isWalletConnected={isWalletConnected}
        connectWallet={connectWallet}
        categories={categories}
      />
    </div>
  );
};

export default WriteReviewTab;
