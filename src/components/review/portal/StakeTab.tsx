
import React from "react";
import StakeRewardsView from "@/components/review/StakeRewardsView";

interface StakeTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakeTab = ({ isWalletConnected, connectWallet }: StakeTabProps) => (
  <StakeRewardsView isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
);

export default StakeTab;
