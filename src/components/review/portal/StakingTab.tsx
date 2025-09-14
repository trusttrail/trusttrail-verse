
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
  const { currentNetwork, tokenBalances, refreshBalances, tokens, address } = useWeb3();
  const { calculateAPY, getStakedBalance } = useStakingTransaction();
  const [stakedAmounts, setStakedAmounts] = React.useState<Record<string, string>>({});
  
  console.log('🔍 StakingTab Debug Info:');
  console.log('  - isWalletConnected:', isWalletConnected);
  console.log('  - Web3 address:', address);
  console.log('  - Token balances:', tokenBalances);
  console.log('  - TRUST tokens available:', tokens.filter(t => t.symbol === 'TRUST'));
  console.log('  - Staked amounts:', stakedAmounts);
  
  // Refresh balances when wallet connects
  React.useEffect(() => {
    if (isWalletConnected && address) {
      console.log('🔄 Wallet connected, refreshing balances...');
      refreshBalances();
    }
  }, [isWalletConnected, address, refreshBalances]);

  // Function to refresh staked amounts
  const refreshStakedAmounts = React.useCallback(async () => {
    if (!address || !isWalletConnected || !["amoy", "ethSepolia", "opSepolia"].includes(currentNetwork)) return;
    
    try {
      const trustStaked = await getStakedBalance(address);
      setStakedAmounts({ TRUST: trustStaked });
      console.log('🏦 Fetched staked amounts:', { TRUST: trustStaked });
    } catch (error) {
      console.error('Error fetching staked amounts:', error);
      setStakedAmounts({ TRUST: "0" });
    }
  }, [address, isWalletConnected, currentNetwork, getStakedBalance]);

  // Fetch staked amounts when wallet connects
  React.useEffect(() => {
    refreshStakedAmounts();
  }, [refreshStakedAmounts]);

  // Only show TRUST token for staking
  const trustToken = tokens.find(t => t.symbol === 'TRUST');
  const stakingTokens = trustToken ? [trustToken] : [];

  const stakingAPYs: Record<string, string> = { TRUST: "25%" };

  const isValidNetwork = ["amoy", "ethSepolia", "opSepolia"].includes(currentNetwork);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Token Staking</h2>
      <p className="text-muted-foreground mb-8">Stake your tokens to earn rewards on supported networks</p>
      
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
              <p className="mb-4 text-muted-foreground">Please switch to a supported testnet</p>
              <Badge variant="destructive">Wrong Network</Badge>
            </div>
          ) : (
            <StakingForm
              tokens={stakingTokens}
              tokenBalances={tokenBalances}
              refreshBalances={refreshBalances}
              stakingAPYs={stakingAPYs}
              stakedAmounts={stakedAmounts}
              onStakeAmountsChange={refreshStakedAmounts}
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
