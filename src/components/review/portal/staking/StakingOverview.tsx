
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { TokenInfo } from '@/services/web3Service';
import { useStakingTransaction } from '@/hooks/useStakingTransaction';
import { useWeb3 } from '@/hooks/useWeb3';

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
  const { address } = useWeb3();
  const { getStakedBalance, getRewards, calculateAPY } = useStakingTransaction();
  const [realStakedBalance, setRealStakedBalance] = useState("0");
  const [rewards, setRewards] = useState({ daily: "0", weekly: "0", monthly: "0" });
  const [realAPY, setRealAPY] = useState("0%");

  // Only show TRUST token
  const trustToken = tokens.find(t => t.symbol === 'TRUST');

  useEffect(() => {
    const fetchStakingData = async () => {
      if (!address || !isWalletConnected || !isValidNetwork) return;
      
      try {
        const stakedBalance = await getStakedBalance(address);
        const userRewards = await getRewards(address);
        const currentAPY = calculateAPY();
        
        setRealStakedBalance(stakedBalance);
        setRewards(userRewards);
        setRealAPY(currentAPY);
      } catch (error) {
        console.error('Error fetching staking data:', error);
      }
    };

    fetchStakingData();
  }, [address, isWalletConnected, isValidNetwork, getStakedBalance, getRewards, calculateAPY]);
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
          ) : trustToken ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{trustToken.icon}</span>
                  <div>
                    <p className="font-medium">{trustToken.symbol}</p>
                    <p className="text-sm text-muted-foreground">{realAPY} APY</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{realStakedBalance}</p>
                  <p className="text-sm text-muted-foreground">Staked</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No TRUST tokens available for staking</p>
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
                  <p className="text-2xl font-bold text-green-500">{realStakedBalance} TRUST</p>
                  <p className="text-sm text-muted-foreground">Total Staked</p>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <p className="text-2xl font-bold text-blue-500">{rewards.daily} TRUST</p>
                  <p className="text-sm text-muted-foreground">Daily Rewards</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Daily Rewards:</span>
                  <span className="text-green-500">+{rewards.daily} TRUST</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekly Rewards:</span>
                  <span className="text-green-500">+{rewards.weekly} TRUST</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rewards:</span>
                  <span className="text-green-500">+{rewards.monthly} TRUST</span>
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
