import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Coins, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';
import { useStakingTransaction } from '@/hooks/useStakingTransaction';

interface StakeTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakeTab = ({ isWalletConnected, connectWallet }: StakeTabProps) => {
  const { toast } = useToast();
  const web3Data = useWeb3();
  const { tokenBalances, address, currentNetwork, refreshBalances } = web3Data;
  
  // Force log the Web3 data
  console.log('🎯 STAKETAB - Raw Web3 data:', web3Data);
  console.log('🎯 STAKETAB - tokenBalances specifically:', tokenBalances);
  console.log('🎯 STAKETAB - address:', address);
  console.log('🎯 STAKETAB - currentNetwork:', currentNetwork);
  const { 
    executeStaking, 
    calculateAPY, 
    getStakedBalance, 
    getRewards, 
    claimRewards,
    isLoading: isStakingLoading,
    isTransactionPending 
  } = useStakingTransaction();
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [rewards, setRewards] = useState({ daily: "0", weekly: "0", monthly: "0" });

  const isValidNetwork = currentNetwork === "amoy" || currentNetwork === "ethSepolia" || currentNetwork === "opSepolia";
  const trstBalance = tokenBalances["TRST"] || "0";
  const calculatedAPY = calculateAPY();

  // Enhanced debug logging
  console.log('🔍 StakeTab Debug - TRST Balance:', {
    tokenBalances,
    trstBalance,
    address,
    isWalletConnected,
    isValidNetwork,
    stakedBalance,
    rewards
  });

  // Force re-render when balance data changes
  useEffect(() => {
    console.log('🔄 StakeTab data changed:', { trstBalance, stakedBalance, rewards });
  }, [trstBalance, stakedBalance, rewards]);

  // Load staked balance and rewards when wallet is connected
  useEffect(() => {
    const loadStakingData = async () => {
      if (!address || !isWalletConnected || !isValidNetwork) return;
      
      try {
        console.log('🔄 Loading staking data for address:', address);
        const [staked, rewardsData] = await Promise.all([
          getStakedBalance(address),
          getRewards(address)
        ]);
        
        setStakedBalance(staked);
        setRewards(rewardsData);
        console.log('📊 Loaded staking data:', { staked, rewards: rewardsData });
      } catch (error) {
        console.error('Error loading staking data:', error);
      }
    };

    loadStakingData();
  }, [address, isWalletConnected, isValidNetwork, getStakedBalance, getRewards]);

  // Refresh data after successful transactions
  const refreshStakingData = async () => {
    if (!address) return;
    await refreshBalances();
    const [staked, rewardsData] = await Promise.all([
      getStakedBalance(address),
      getRewards(address)
    ]);
    setStakedBalance(staked);
    setRewards(rewardsData);
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your MetaMask wallet to stake tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to a supported testnet (Polygon Amoy or OP Sepolia) to stake tokens.",
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

    const result = await executeStaking(stakeAmount, 'stake');
    
    if (result.success) {
      toast({
        title: "Staking Successful! 🎉",
        description: `Staked ${stakeAmount} TRST successfully. Transaction: ${result.txHash?.substring(0, 10)}...`,
      });
      setStakeAmount("");
      await refreshStakingData();
    } else {
      toast({
        title: "Staking Failed",
        description: result.error || "Staking transaction failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your MetaMask wallet to unstake tokens.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to a supported testnet (Polygon Amoy or OP Sepolia) to unstake tokens.",
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

    const result = await executeStaking(unstakeAmount, 'unstake');
    
    if (result.success) {
      toast({
        title: "Unstaking Successful! 🎉",
        description: `Unstaked ${unstakeAmount} TRST successfully. Transaction: ${result.txHash?.substring(0, 10)}...`,
      });
      setUnstakeAmount("");
      await refreshStakingData();
    } else {
      toast({
        title: "Unstaking Failed",
        description: result.error || "Unstaking transaction failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClaimRewards = async () => {
    const result = await claimRewards();
    
    if (result.success) {
      toast({
        title: "Rewards Claimed! 🎉",
        description: `Successfully claimed your daily rewards. Transaction: ${result.txHash?.substring(0, 10)}...`,
      });
      await refreshStakingData();
    } else {
      toast({
        title: "Claim Failed",
        description: result.error || "Failed to claim rewards. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">TRST Token Staking</h2>
      <p className="text-muted-foreground mb-8">Stake your tokens to earn {calculatedAPY} APY on supported networks</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staking Interface */}
        <div className="space-y-6">
          {/* Current Balances */}
          <Card>
            <CardHeader>
              <CardTitle>TRST Token Information</CardTitle>
              <CardDescription>Your current TRST token balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Available Balance</p>
                  <p className="font-medium text-lg">
                    {/* Debug: Explicit logging here */}
                    {(() => {
                      console.log('🎯 UI RENDER - trstBalance value:', trstBalance, typeof trstBalance);
                      console.log('🎯 UI RENDER - tokenBalances:', tokenBalances);
                      console.log('🎯 UI RENDER - tokenBalances["TRST"]:', tokenBalances["TRST"]);
                      return trstBalance;
                    })()} TRST
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Staked Balance</p>
                  <p className="font-medium text-lg">{stakedBalance} TRST</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/40 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current APY:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {calculatedAPY}
                  </Badge>
                </div>
              </div>
              <Button onClick={refreshBalances} variant="outline" size="sm" className="mb-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Force Refresh Balances
              </Button>
            </CardContent>
          </Card>

          {/* Stake Form */}
          <Card>
            <CardHeader>
              <CardTitle>Stake TRST Tokens</CardTitle>
              <CardDescription>Stake your TRST tokens to start earning rewards</CardDescription>
            </CardHeader>
            <CardContent>
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
                <form onSubmit={handleStake} className="space-y-4">
                  <div>
                    <label htmlFor="stake-amount" className="block text-sm font-medium mb-2">
                      Amount to Stake
                    </label>
                    <div className="relative">
                      <Input
                        id="stake-amount"
                        type="number"
                        placeholder="0"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="pr-16"
                        step="1"
                        min="1"
                        max={trstBalance}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-sm text-muted-foreground">TRST</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Available: {trstBalance} TRST
                    </p>
                  </div>
                  
                  {stakeAmount && parseFloat(stakeAmount) > 0 && (
                    <div className="bg-muted/40 p-3 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <span className="text-green-500 font-medium">{calculatedAPY}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Daily Rewards:</span>
                        <span>{(parseFloat(stakeAmount) * 0.30 / 365).toFixed(4)} TRST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Fee:</span>
                        <span>~0.001 POL</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                    disabled={isTransactionPending || !stakeAmount || parseFloat(stakeAmount) <= 0}
                  >
                    {isTransactionPending ? (
                      <>
                        <RefreshCw className="mr-2 animate-spin" size={18} />
                        Staking...
                      </>
                    ) : (
                      <>
                        <Coins className="mr-2" size={18} />
                        Stake TRST
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Unstake Form */}
          <Card>
            <CardHeader>
              <CardTitle>Unstake TRST Tokens</CardTitle>
              <CardDescription>Withdraw your staked TRST tokens</CardDescription>
            </CardHeader>
            <CardContent>
              {!isWalletConnected ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Connect wallet to unstake</p>
                </div>
              ) : !isValidNetwork ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Switch to Amoy network</p>
                </div>
              ) : parseFloat(stakedBalance) <= 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No TRST tokens staked</p>
                </div>
              ) : (
                <form onSubmit={handleUnstake} className="space-y-4">
                  <div>
                    <label htmlFor="unstake-amount" className="block text-sm font-medium mb-2">
                      Amount to Unstake
                    </label>
                    <div className="relative">
                      <Input
                        id="unstake-amount"
                        type="number"
                        placeholder="0"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="pr-16"
                        step="1"
                        min="1"
                        max={stakedBalance}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-sm text-muted-foreground">TRST</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Staked: {stakedBalance} TRST
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="outline"
                    className="w-full"
                    disabled={isTransactionPending || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
                  >
                    {isTransactionPending ? (
                      <>
                        <RefreshCw className="mr-2 animate-spin" size={18} />
                        Unstaking...
                      </>
                    ) : (
                      "Unstake TRST"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Staking Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staking Overview</CardTitle>
              <CardDescription>Your current TRST staking position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔷</span>
                  <div>
                    <p className="font-medium">TRST</p>
                    <p className="text-sm text-muted-foreground">{calculatedAPY} APY</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{stakedBalance} TRST</p>
                  <p className="text-sm text-muted-foreground">Staked</p>
                </div>
              </div>
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
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span>Daily Rewards:</span>
                   <span className="text-green-500">{rewards.daily} TRST</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Weekly Rewards:</span>
                   <span className="text-green-500">{rewards.weekly} TRST</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Monthly Rewards:</span>
                   <span className="text-green-500">{rewards.monthly} TRST</span>
                 </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClaimRewards}
                disabled={isTransactionPending || parseFloat(stakedBalance) <= 0}
              >
                {isTransactionPending ? (
                  <>
                    <RefreshCw className="mr-2 animate-spin" size={18} />
                    Claiming...
                  </>
                ) : (
                  "Claim Daily Rewards"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StakeTab;