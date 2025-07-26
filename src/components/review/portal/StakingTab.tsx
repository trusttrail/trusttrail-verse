
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from '@/hooks/useWeb3';
import { useStakingTransaction } from '@/hooks/useStakingTransaction';
import StakingForm from './staking/StakingForm';
import StakingOverview from './staking/StakingOverview';

interface StakingTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakingTab = ({ isWalletConnected, connectWallet }: StakingTabProps) => {
  const { currentNetwork, tokenBalances, refreshBalances, tokens } = useWeb3();
  const { calculateAPY } = useStakingTransaction();

  // Only show TRUST token for staking
  const trustToken = tokens.find(t => t.symbol === 'TRUST');
  const stakingTokens = trustToken ? [trustToken] : [];

  const stakingAPYs: Record<string, string> = {
    TRUST: calculateAPY()
  };

  // Real staked amounts will be fetched from blockchain in StakingOverview
  const stakedAmounts: Record<string, string> = {
    TRUST: "0"
  };

  const isValidNetwork = currentNetwork === "amoy";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Token Staking</h2>
      <p className="text-muted-foreground mb-8">Stake your tokens to earn rewards on Polygon Amoy</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staking Interface */}
        <div>
          {!isWalletConnected ? (
            <div className="text-center py-6">
              <p className="mb-4 text-muted-foreground">Connect your wallet to stake tokens</p>
              <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                <Wallet className="mr-2" size={18} />
                Connect Wallet
              </Button>
            </div>
          ) : !isValidNetwork ? (
            <div className="text-center py-6">
              <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
              <p className="mb-4 text-muted-foreground">Please switch to Polygon Amoy testnet</p>
              <Badge variant="destructive">Wrong Network</Badge>
            </div>
          ) : (
            <StakingForm
              tokens={stakingTokens}
              tokenBalances={tokenBalances}
              refreshBalances={refreshBalances}
              stakingAPYs={stakingAPYs}
              stakedAmounts={stakedAmounts}
            />
          )}
        </div>

        {/* Staking Overview */}
        <StakingOverview
          tokens={stakingTokens}
          stakingAPYs={stakingAPYs}
          stakedAmounts={stakedAmounts}
          isWalletConnected={isWalletConnected}
          isValidNetwork={isValidNetwork}
        />
      </div>
    </div>
  );
};

export default StakingTab;
