
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Star, MessageSquare, Building, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StakeRewardsViewProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakeRewardsView = ({ isWalletConnected, connectWallet }: StakeRewardsViewProps) => {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  
  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to stake $TRUST tokens.",
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
    
    setIsStaking(true);
    
    // Simulate staking process
    setTimeout(() => {
      toast({
        title: "Staking Successful",
        description: `You have staked ${stakeAmount} $TRUST tokens.`,
      });
      
      setStakeAmount("");
      setIsStaking(false);
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Stake $TRUST for Rewards</h2>
      <p className="text-muted-foreground mb-8">Earn rewards by staking your $TRUST tokens and supporting the TrustTrail ecosystem</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Staking Benefits</CardTitle>
              <CardDescription>Earn rewards and gain privileges by staking $TRUST tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <Award className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Earn APY</h4>
                    <p className="text-sm text-muted-foreground">Earn up to 15% APY on your staked $TRUST tokens</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <Star className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Boost</h4>
                    <p className="text-sm text-muted-foreground">Your reviews gain more visibility and weight in the ecosystem</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <MessageSquare className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Priority Support</h4>
                    <p className="text-sm text-muted-foreground">Get priority support and access to exclusive features</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-trustpurple-500/10 p-2 rounded-full">
                    <Building className="text-trustpurple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Governance Rights</h4>
                    <p className="text-sm text-muted-foreground">Participate in ecosystem governance decisions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10 p-4 rounded-lg">
                <h4 className="font-semibold flex items-center">
                  <Star className="mr-2 text-trustpurple-500" size={20} />
                  Current Staking Stats
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Staked</p>
                    <p className="font-semibold text-lg">4,253,689 $TRUST</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current APY</p>
                    <p className="font-semibold text-lg text-green-500">15.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stakers</p>
                    <p className="font-semibold text-lg">1,837</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Stake $TRUST</CardTitle>
              <CardDescription>Stake your tokens to earn rewards</CardDescription>
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
                        <span className="text-sm text-muted-foreground">$TRUST</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Balance:</span>
                    <span>1,000 $TRUST</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Staking Period</span>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-6">
                    <span>Estimated APY</span>
                    <span className="text-green-500 font-medium">15.2%</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                    disabled={isStaking}
                  >
                    {isStaking ? "Staking..." : "Stake Tokens"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StakeRewardsView;
