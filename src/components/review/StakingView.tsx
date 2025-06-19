import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Award, Star, MessageSquare, Building, Wallet, Clock, TrendingUp, History, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StakingViewProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakingView = ({ isWalletConnected, connectWallet }: StakingViewProps) => {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState("standard");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  const stakingPools = [
    {
      id: "standard",
      name: "Standard Pool",
      apy: "12.5%",
      lockPeriod: "30 days",
      minStake: "100",
      totalStaked: "2,145,892",
      description: "Balanced rewards with moderate lock period"
    },
    {
      id: "premium",
      name: "Premium Pool",
      apy: "18.2%",
      lockPeriod: "90 days",
      minStake: "1,000",
      totalStaked: "1,567,234",
      description: "Higher rewards for longer commitment"
    },
    {
      id: "elite",
      name: "Elite Pool",
      apy: "25.7%",
      lockPeriod: "180 days",
      minStake: "5,000",
      totalStaked: "892,456",
      description: "Maximum rewards for elite stakers"
    }
  ];

  // Only show user stakes if wallet is connected
  const userStakes = isWalletConnected ? [
    {
      id: 1,
      pool: "Standard Pool",
      amount: "500",
      rewards: "12.45",
      startDate: "2025-05-01",
      endDate: "2025-06-01",
      status: "Active"
    },
    {
      id: 2,
      pool: "Premium Pool",
      amount: "1,200",
      rewards: "45.78",
      startDate: "2025-04-15",
      endDate: "2025-07-15",
      status: "Active"
    }
  ] : [];

  const selectedPoolData = stakingPools.find(pool => pool.id === selectedPool);
  
  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to stake $NOCAP tokens.",
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

    if (parseFloat(stakeAmount) < parseFloat(selectedPoolData?.minStake || "0")) {
      toast({
        title: "Minimum Stake Required",
        description: `Minimum stake for ${selectedPoolData?.name} is ${selectedPoolData?.minStake} $NOCAP.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsStaking(true);
    
    setTimeout(() => {
      toast({
        title: "Staking Successful",
        description: `You have staked ${stakeAmount} $NOCAP tokens in ${selectedPoolData?.name}.`,
      });
      
      setStakeAmount("");
      setIsStaking(false);
    }, 2000);
  };

  const handleUnstake = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to unstake tokens.",
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
    
    setTimeout(() => {
      toast({
        title: "Unstaking Initiated",
        description: `Unstaking ${unstakeAmount} $NOCAP tokens. Tokens will be available after the lock period.`,
      });
      
      setUnstakeAmount("");
      setIsUnstaking(false);
    }, 2000);
  };

  const handleClaimRewards = () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      });
      return;
    }

    setIsClaiming(true);
    
    setTimeout(() => {
      toast({
        title: "Rewards Claimed",
        description: "Your staking rewards have been claimed successfully!",
      });
      
      setIsClaiming(false);
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Advanced Staking Pools</h2>
      <p className="text-muted-foreground mb-8">Choose from multiple staking pools with different reward rates and lock periods</p>
      
      <Tabs defaultValue="stake" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stake">Stake</TabsTrigger>
          <TabsTrigger value="unstake">Unstake</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Staking Pools */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Available Staking Pools</h3>
              {stakingPools.map((pool) => (
                <Card key={pool.id} className={`cursor-pointer transition-all ${selectedPool === pool.id ? 'ring-2 ring-trustpurple-500' : ''}`} onClick={() => setSelectedPool(pool.id)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{pool.name}</h4>
                        <p className="text-sm text-muted-foreground">{pool.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-trustpurple-500/10 text-trustpurple-500">
                        {pool.apy} APY
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Lock Period</p>
                        <p className="font-medium">{pool.lockPeriod}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Stake</p>
                        <p className="font-medium">{pool.minStake} $NOCAP</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Staked</p>
                        <p className="font-medium">{pool.totalStaked} $NOCAP</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Stake Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Stake $NOCAP</CardTitle>
                  <CardDescription>
                    {selectedPoolData ? `Staking in ${selectedPoolData.name}` : 'Select a pool to start staking'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isWalletConnected ? (
                    <div className="text-center py-6">
                      <p className="mb-4 text-muted-foreground">Connect your wallet to start staking</p>
                      <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                        <Wallet className="mr-2" size={18} />
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleStake} className="space-y-6">
                      <div>
                        <label htmlFor="stake-amount" className="block text-sm font-medium mb-2">Amount to Stake</label>
                        <div className="relative">
                          <Input
                            id="stake-amount"
                            type="number"
                            placeholder="0.00"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="pr-16"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">$NOCAP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Balance:</span>
                          <span>5,000 $NOCAP</span>
                        </div>
                        <div className="flex justify-between">
                          <span>APY:</span>
                          <span className="text-green-500 font-medium">{selectedPoolData?.apy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lock Period:</span>
                          <span>{selectedPoolData?.lockPeriod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Min Stake:</span>
                          <span>{selectedPoolData?.minStake} $NOCAP</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                        disabled={isStaking || !selectedPoolData}
                      >
                        {isStaking ? "Staking..." : `Stake in ${selectedPoolData?.name || 'Selected Pool'}`}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="unstake" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Stakes</CardTitle>
                <CardDescription>Manage your active stakes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isWalletConnected ? (
                  <div className="text-center py-6">
                    <p className="mb-4 text-muted-foreground">Connect your wallet to view your stakes</p>
                    <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                      <Wallet className="mr-2" size={18} />
                      Connect Wallet
                    </Button>
                  </div>
                ) : userStakes.length > 0 ? (
                  userStakes.map((stake) => (
                    <div key={stake.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{stake.pool}</h4>
                        <Badge variant={stake.status === 'Active' ? 'default' : 'secondary'}>
                          {stake.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Staked</p>
                          <p className="font-medium">{stake.amount} $NOCAP</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rewards</p>
                          <p className="font-medium text-green-500">{stake.rewards} $NOCAP</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-medium">{stake.endDate}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No active stakes found</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Unstake Tokens</CardTitle>
                <CardDescription>Withdraw your staked tokens</CardDescription>
              </CardHeader>
              <CardContent>
                {!isWalletConnected ? (
                  <div className="text-center py-6">
                    <p className="mb-4 text-muted-foreground">Connect your wallet to unstake</p>
                    <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                      <Wallet className="mr-2" size={18} />
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleUnstake} className="space-y-6">
                    <div>
                      <label htmlFor="unstake-amount" className="block text-sm font-medium mb-2">Amount to Unstake</label>
                      <div className="relative">
                        <Input
                          id="unstake-amount"
                          type="number"
                          placeholder="0.00"
                          value={unstakeAmount}
                          onChange={(e) => setUnstakeAmount(e.target.value)}
                          className="pr-16"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-sm text-muted-foreground">$NOCAP</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Staked:</span>
                        <span>1,700 $NOCAP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available to Unstake:</span>
                        <span>500 $NOCAP</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-red-500 to-red-600 w-full"
                      disabled={isUnstaking}
                    >
                      {isUnstaking ? "Processing..." : "Unstake Tokens"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="text-trustpurple-500" size={20} />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isWalletConnected ? (
                  <div className="text-center py-6">
                    <p className="mb-4 text-muted-foreground">Connect your wallet to view rewards</p>
                    <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                      <Wallet className="mr-2" size={18} />
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-green-500">58.23</p>
                    <p className="text-muted-foreground">$NOCAP</p>
                    <Button 
                      onClick={handleClaimRewards}
                      disabled={isClaiming}
                      className="mt-4 bg-gradient-to-r from-green-500 to-green-600"
                    >
                      {isClaiming ? "Claiming..." : "Claim Rewards"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Rewards Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {!isWalletConnected ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Connect your wallet to view rewards breakdown</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userStakes.map((stake) => (
                      <div key={stake.id} className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                        <div>
                          <p className="font-medium">{stake.pool}</p>
                          <p className="text-sm text-muted-foreground">{stake.amount} $NOCAP staked</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-500">+{stake.rewards} $NOCAP</p>
                          <p className="text-xs text-muted-foreground">Since {stake.startDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History size={20} />
                Staking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isWalletConnected ? (
                <div className="text-center py-6">
                  <p className="mb-4 text-muted-foreground">Connect your wallet to view transaction history</p>
                  <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                    <Wallet className="mr-2" size={18} />
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { type: "Stake", amount: "500", pool: "Standard Pool", date: "2025-05-01", status: "Completed" },
                    { type: "Stake", amount: "1,200", pool: "Premium Pool", date: "2025-04-15", status: "Completed" },
                    { type: "Claim", amount: "15.67", pool: "Standard Pool", date: "2025-04-30", status: "Completed" },
                    { type: "Unstake", amount: "200", pool: "Standard Pool", date: "2025-04-20", status: "Completed" },
                  ].map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'Stake' ? 'bg-green-500' : 
                          transaction.type === 'Unstake' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium">{transaction.type} - {transaction.pool}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'Unstake' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {transaction.type === 'Unstake' ? '-' : '+'}{transaction.amount} $NOCAP
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StakingView;
