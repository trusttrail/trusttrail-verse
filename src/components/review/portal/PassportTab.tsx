
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import PassportStatusCard from './passport/PassportStatusCard';
import PassportProgressBar from './passport/PassportProgressBar';
import PassportInstructions from './passport/PassportInstructions';
import UserDashboard from './passport/UserDashboard';
import UserActivity from './passport/UserActivity';
import WalletConnectionPrompt from './passport/WalletConnectionPrompt';

interface PassportTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const PassportTab = ({ isWalletConnected, connectWallet }: PassportTabProps) => {
  const { toast } = useToast();
  const { walletAddress } = useWalletConnection();
  const { 
    passportData, 
    isVerified, 
    passportScore, 
    needsRefresh,
    isVerifying,
    verifyPassport, 
    refreshPassportScore 
  } = useGitcoinPassport();
  
  const [userStats] = useState({
    reviewsGiven: 12,
    topUpvotedReview: "Amazing DeFi experience with QuickSwap",
    trustEarned: 245.78,
    reputationScore: 8.5
  });

  const handleVerifyPassport = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first before verifying your passport.",
        variant: "destructive",
      });
      return;
    }

    await verifyPassport(walletAddress);
  };

  const handleRefreshPassport = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first before refreshing your passport.",
        variant: "destructive",
      });
      return;
    }

    await refreshPassportScore(walletAddress);
  };

  if (!isWalletConnected) {
    return <WalletConnectionPrompt connectWallet={connectWallet} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Gitcoin Passport & Dashboard</h1>
        <p className="text-muted-foreground">
          Verify your identity and track your TrustTrail journey
        </p>
      </div>

      {/* Passport Verification Section */}
      <PassportStatusCard
        isVerified={isVerified}
        isVerifying={isVerifying}
        passportScore={passportScore}
        passportData={passportData}
        needsRefresh={needsRefresh}
        onVerifyPassport={handleVerifyPassport}
        onRefreshPassport={handleRefreshPassport}
      />
      
      {/* Progress Bar */}
      <PassportProgressBar 
        passportScore={passportScore} 
        isVerified={isVerified} 
      />

      {/* Instructions */}
      <PassportInstructions
        isVerified={isVerified}
        isVerifying={isVerifying}
        needsRefresh={needsRefresh}
      />

      {/* User Dashboard */}
      <UserDashboard 
        userStats={userStats}
        passportScore={passportScore}
        isVerified={isVerified}
      />

      {/* Top Review & Analytics */}
      <UserActivity 
        userStats={userStats}
        isVerified={isVerified}
      />
    </div>
  );
};

export default PassportTab;
