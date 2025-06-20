
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from '@/hooks/useWeb3';
import StakingForm from './staking/StakingForm';
import StakingOverview from './staking/StakingOverview';

interface StakingTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakingTab = ({ isWalletConnected, connectWallet }: StakingTabProps) => {
  const { currentNetwork, tokenBalances, refreshBalances, tokens } = useWeb3();

  const stakingAPYs: Record<string, string> = {
    TRUST: "25.5%",
    MATIC: "12.2%",
    ETH: "8.2%",
    BTC: "6.8%",
    USDT: "12.4%",
    USDC: "11.9%"
  };

  // Mock staked amounts (in production, fetch from smart contract)
  const stakedAmounts: Record<string, string> = {
    TRUST: "500.00",
    MATIC: "100.00",
    ETH: "1.00",
    BTC: "0.05",
    USDT: "2000.00",
    USDC: "1500.00"
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
              tokens={tokens}
              tokenBalances={tokenBalances}
              refreshBalances={refreshBalances}
              stakingAPYs={stakingAPYs}
              stakedAmounts={stakedAmounts}
            />
          )}
        </div>

        {/* Staking Overview */}
        <StakingOverview
          tokens={tokens}
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
