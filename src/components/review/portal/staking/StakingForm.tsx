
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Coins, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';
import { useStakingTransaction } from '@/hooks/useStakingTransaction';
import { TokenInfo } from '@/services/web3Service';

interface StakingFormProps {
  tokens: TokenInfo[];
  tokenBalances: Record<string, string>;
  refreshBalances: () => Promise<void>;
  stakingAPYs: Record<string, string>;
  stakedAmounts: Record<string, string>;
}

const StakingForm: React.FC<StakingFormProps> = ({
  tokens,
  tokenBalances,
  refreshBalances,
  stakingAPYs,
  stakedAmounts
}) => {
  console.log('🎯 StakingForm received tokenBalances:', tokenBalances);
  console.log('🎯 StakingForm received tokens:', tokens);
  const { toast } = useToast();
  const { currentNetwork, address } = useWeb3();
  const { executeStaking, isLoading: isTransactionLoading } = useStakingTransaction();
  const [selectedToken, setSelectedToken] = useState("TRUST");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  // Only show TRUST token for staking
  const trustToken = tokens.find(t => t.symbol === 'TRUST');
  const filteredTokens = trustToken ? [trustToken] : [];

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentNetwork !== "amoy") {
      toast({
        title: "Wrong Network",
        description: "Please switch to Polygon Amoy testnet to stake tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }

    const totalBalance = parseFloat(tokenBalances[selectedToken] || "0");
    const alreadyStaked = parseFloat(stakedAmounts[selectedToken] || "0");
    const availableBalance = Math.max(0, totalBalance - alreadyStaked);
    const requestedAmount = parseFloat(stakeAmount);
    
    if (requestedAmount > availableBalance) {
      toast({
        title: "Insufficient Available Balance",
        description: `You don't have enough ${selectedToken} available to stake. Available: ${availableBalance.toFixed(2)} (Total: ${totalBalance} - Staked: ${alreadyStaked})`,
        variant: "destructive",
      });
      return;
    }

    setIsStaking(true);
    
    try {
      const result = await executeStaking(stakeAmount, 'stake');
      
      if (result.success) {
        toast({
          title: "Staking Successful! 🎉",
          description: `Staked ${stakeAmount} ${selectedToken} successfully. TX: ${result.txHash?.substring(0, 10)}...`,
        });
        setStakeAmount("");
        await refreshBalances();
      } else {
        toast({
          title: "Staking Failed",
          description: result.error || "Staking transaction failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Staking failed:', error);
      toast({
        title: "Staking Failed",
        description: error.message || "Staking transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentNetwork !== "amoy") {
      toast({
        title: "Wrong Network",
        description: "Please switch to Polygon Amoy testnet to unstake tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to unstake.",
        variant: "destructive",
      });
      return;
    }

    setIsUnstaking(true);
    
    try {
      const result = await executeStaking(unstakeAmount, 'unstake');
      
      if (result.success) {
        toast({
          title: "Unstaking Successful! 🎉",
          description: `Unstaked ${unstakeAmount} ${selectedToken} successfully. TX: ${result.txHash?.substring(0, 10)}...`,
        });
        setUnstakeAmount("");
        await refreshBalances();
      } else {
        toast({
          title: "Unstaking Failed",
          description: result.error || "Unstaking transaction failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Unstaking failed:', error);
      toast({
        title: "Unstaking Failed",
        description: error.message || "Unstaking transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Token to Stake</CardTitle>
          <CardDescription>Choose from available staking tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filteredTokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-3 w-full">
                    <span>{token.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-2">{token.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {stakingAPYs[token.symbol]} APY
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedTokenData && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Balance</p>
                <p className="font-medium">{parseFloat(tokenBalances[selectedToken] || "0").toFixed(0)} {selectedToken}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Already Staked</p>
                <p className="font-medium">{stakedAmounts[selectedToken] || "0"} {selectedToken}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available to Stake</p>
                <p className="font-medium text-green-600">
                  {Math.max(0, parseFloat(tokenBalances[selectedToken] || "0") - parseFloat(stakedAmounts[selectedToken] || "0")).toFixed(0)} {selectedToken}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stake Form */}
      <Card>
        <CardHeader>
          <CardTitle>Stake Tokens</CardTitle>
          <CardDescription>Stake your tokens to start earning rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStake} className="space-y-4">
            <div>
              <label htmlFor="stake-amount" className="block text-sm font-medium mb-2">
                Amount to Stake
              </label>
              <div className="relative">
                <Input
                  id="stake-amount"
                  type="number"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="pr-16"
                  step="0.000001"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">{selectedToken}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Max: {parseFloat(tokenBalances[selectedToken] || "0").toFixed(0)} {selectedToken}
              </p>
            </div>
            
            {selectedTokenData && stakeAmount && (
              <div className="bg-muted/40 p-3 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>APY:</span>
                  <span className="text-green-500 font-medium">{stakingAPYs[selectedToken]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Daily Rewards:</span>
                  <span>{(parseFloat(stakeAmount) * 0.25 / 365).toFixed(6)} {selectedToken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>~0.001 MATIC</span>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
              disabled={isStaking || isTransactionLoading || !stakeAmount}
            >
              {isStaking ? (
                <>
                  <RefreshCw className="mr-2 animate-spin" size={18} />
                  Staking...
                </>
              ) : (
                <>
                  <Coins className="mr-2" size={18} />
                  Stake {selectedToken}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Unstake Form */}
      <Card>
        <CardHeader>
          <CardTitle>Unstake Tokens</CardTitle>
          <CardDescription>Withdraw your staked tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnstake} className="space-y-4">
            <div>
              <label htmlFor="unstake-amount" className="block text-sm font-medium mb-2">
                Amount to Unstake
              </label>
              <div className="relative">
                <Input
                  id="unstake-amount"
                  type="number"
                  placeholder="0.00"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="pr-16"
                  step="0.000001"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">{selectedToken}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Staked: {stakedAmounts[selectedToken]} {selectedToken}
              </p>
            </div>
            
            <Button 
              type="submit" 
              variant="outline"
              className="w-full"
              disabled={isUnstaking || isTransactionLoading || !unstakeAmount}
            >
              {isUnstaking ? (
                <>
                  <RefreshCw className="mr-2 animate-spin" size={18} />
                  Unstaking...
                </>
              ) : (
                `Unstake ${selectedToken}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingForm;
