
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { TokenInfo } from '@/services/web3Service';

interface StakingOverviewProps {
  tokens: TokenInfo[];
  stakingAPYs: Record<string, string>;
  stakedAmounts: Record<string, string>;
  isWalletConnected: boolean;
  isValidNetwork: boolean;
}

const StakingOverview: React.FC<StakingOverviewProps> = ({
  tokens,
  stakingAPYs,
  stakedAmounts,
  isWalletConnected,
  isValidNetwork
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staking Overview</CardTitle>
          <CardDescription>Your current staking positions</CardDescription>
        </CardHeader>
        <CardContent>
          {!isWalletConnected ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Connect wallet to view staking positions</p>
            </div>
          ) : !isValidNetwork ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Switch to Polygon Amoy to view positions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div key={token.symbol} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{token.icon}</span>
                    <div>
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stakingAPYs[token.symbol]} APY</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{stakedAmounts[token.symbol]}</p>
                    <p className="text-sm text-muted-foreground">Staked</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Rewards Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isWalletConnected ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Connect wallet to view rewards</p>
            </div>
          ) : !isValidNetwork ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Switch to Polygon Amoy to view rewards</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">$245.67</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">$12.34</p>
                  <p className="text-sm text-muted-foreground">Pending Rewards</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Daily Rewards:</span>
                  <span className="text-green-500">+$3.45</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Rewards:</span>
                  <span className="text-green-500">+$24.15</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rewards:</span>
                  <span className="text-green-500">+$103.50</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Claim All Rewards
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingOverview;
