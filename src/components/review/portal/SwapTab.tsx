
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from '@/hooks/useWeb3';
import SwapForm from './swap/SwapForm';
import TokenBalanceCard from './swap/TokenBalanceCard';
import SwapInfoCard from './swap/SwapInfoCard';

interface SwapTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const SwapTab = ({ isWalletConnected, connectWallet }: SwapTabProps) => {
  const { currentNetwork, tokenBalances, refreshBalances, tokens } = useWeb3();
  const isValidNetwork = currentNetwork === "amoy";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Token Swap</h2>
      <p className="text-muted-foreground mb-8">Swap tokens instantly on Polygon Amoy testnet</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swap Interface */}
        <div>
          {!isWalletConnected ? (
            <div className="text-center py-6">
              <p className="mb-4 text-muted-foreground">Connect your wallet to start swapping</p>
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
            <SwapForm 
              tokens={tokens}
              tokenBalances={tokenBalances}
              refreshBalances={refreshBalances}
            />
          )}
        </div>

        {/* Token Balances & Info */}
        <div className="space-y-6">
          <TokenBalanceCard
            tokens={tokens}
            tokenBalances={tokenBalances}
            refreshBalances={refreshBalances}
            isWalletConnected={isWalletConnected}
            isValidNetwork={isValidNetwork}
          />
          <SwapInfoCard />
        </div>
      </div>
    </div>
  );
};

export default SwapTab;
