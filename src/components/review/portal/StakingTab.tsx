
import React from "react";
import StakingView from "@/components/review/StakingView";

interface StakingTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakingTab = ({ isWalletConnected, connectWallet }: StakingTabProps) => (
  <StakingView isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
);

export default StakingTab;
