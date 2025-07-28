
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Coins, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';

interface StakeTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const StakeTab = ({ isWalletConnected, connectWallet }: StakeTabProps) => {
  const { toast } = useToast();
  const { web3Service, currentNetwork } = useWeb3();
  const [selectedToken, setSelectedToken] = useState("TRT");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const stakingTokens = [
    {
      symbol: "TRT",
      name: "TRUSTTRAIL",
      balance: "1,234.56",
      staked: "500.00",
      apy: "25.5%",
      icon: "🔷",
      address: "0x69B332336f0DEC19d5423Ea3A5ed783489b9f24cCE"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "2.45",
      staked: "1.00",
      apy: "8.2%",
      icon: "⟠",
      address: "0x0000000000000000000000000000000000000000"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "0.12",
      staked: "0.05",
      apy: "6.8%",
      icon: "₿",
      address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      balance: "5,678.90",
      staked: "2,000.00",
      apy: "12.4%",
      icon: "💚",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "3,456.78",
      staked: "1,500.00",
      apy: "11.9%",
      icon: "🔵",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    }
  ];

  const selectedTokenData = stakingTokens.find(t => t.symbol === selectedToken);
  const isValidNetwork = currentNetwork === "amoy";

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

    setIsStaking(true);
    
    try {
      toast({
        title: "Preparing Stake",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Simulate Web3 staking transaction
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Staking Successful! 🎉",
        description: `Staked ${stakeAmount} ${selectedToken} successfully. Transaction: ${txHash.substring(0, 10)}...`,
      });

      setStakeAmount("");
      
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
      toast({
        title: "Preparing Unstake",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Simulate Web3 unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Unstaking Successful! 🎉",
        description: `Unstaked ${unstakeAmount} ${selectedToken} successfully. Transaction: ${txHash.substring(0, 10)}...`,
      });

      setUnstakeAmount("");
      
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
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Token Staking</h2>
      <p className="text-muted-foreground mb-8">Stake your tokens to earn rewards on Polygon Amoy</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staking Interface */}
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
                  {stakingTokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-3">
                        <span>{token.icon}</span>
                        <div>
                          <span className="font-medium">{token.symbol}</span>
                          <span className="text-sm text-muted-foreground ml-2">{token.name}</span>
                        </div>
                        <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                          {token.apy} APY
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedTokenData && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Available Balance</p>
                    <p className="font-medium">{selectedTokenData.balance} {selectedTokenData.symbol}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Already Staked</p>
                    <p className="font-medium">{selectedTokenData.staked} {selectedTokenData.symbol}</p>
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
                    {selectedTokenData && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Max: {selectedTokenData.balance} {selectedToken}
                      </p>
                    )}
                  </div>
                  
                  {selectedTokenData && stakeAmount && (
                    <div className="bg-muted/40 p-3 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <span className="text-green-500 font-medium">{selectedTokenData.apy}</span>
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
                    disabled={isStaking || !stakeAmount}
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
              )}
            </CardContent>
          </Card>

          {/* Unstake Form */}
          <Card>
            <CardHeader>
              <CardTitle>Unstake Tokens</CardTitle>
              <CardDescription>Withdraw your staked tokens</CardDescription>
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
                    {selectedTokenData && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Staked: {selectedTokenData.staked} {selectedToken}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="outline"
                    className="w-full"
                    disabled={isUnstaking || !unstakeAmount}
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Staking Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staking Overview</CardTitle>
              <CardDescription>Your current staking positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stakingTokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{token.icon}</span>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.apy} APY</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{token.staked}</p>
                      <p className="text-sm text-muted-foreground">Staked</p>
                    </div>
                  </div>
                ))}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StakeTab;
