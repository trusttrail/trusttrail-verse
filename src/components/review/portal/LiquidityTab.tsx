
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Wallet, TrendingUp, Droplets, Info, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';

interface LiquidityTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const LiquidityTab = ({ isWalletConnected, connectWallet }: LiquidityTabProps) => {
  const { toast } = useToast();
  const { web3Service, currentNetwork, tokenBalances, refreshBalances, tokens } = useWeb3();
  const [token1Amount, setToken1Amount] = useState("");
  const [token2Amount, setToken2Amount] = useState("");
  const [selectedPair, setSelectedPair] = useState("MATIC/USDC");
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);

  const liquidityPairs = [
    {
      pair: "MATIC/USDC",
      tvl: "$2,450,000",
      apy: "15.4%",
      volume24h: "$890,000",
      yourLiquidity: "0.00",
      token1: "MATIC",
      token2: "USDC"
    },
    {
      pair: "WETH/WBTC", 
      tvl: "$1,850,000",
      apy: "12.8%",
      volume24h: "$650,000",
      yourLiquidity: "0.00",
      token1: "WETH",
      token2: "WBTC"
    },
    {
      pair: "TRUST/MATIC",
      tvl: "$750,000",
      apy: "28.5%",
      volume24h: "$320,000",
      yourLiquidity: "0.00",
      token1: "TRUST",
      token2: "MATIC"
    },
    {
      pair: "USDT/USDC",
      tvl: "$1,200,000",
      apy: "8.2%",
      volume24h: "$450,000",
      yourLiquidity: "0.00",
      token1: "USDT",
      token2: "USDC"
    },
    {
      pair: "TRUST/USDT",
      tvl: "$650,000",
      apy: "22.1%",
      volume24h: "$280,000",
      yourLiquidity: "0.00",
      token1: "TRUST",
      token2: "USDT"
    }
  ];

  const selectedPairData = liquidityPairs.find(p => p.pair === selectedPair);
  const isValidNetwork = currentNetwork === "amoy";

  const handleAddLiquidity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to add liquidity.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Polygon Amoy testnet to add liquidity.",
        variant: "destructive",
      });
      return;
    }

    if (!token1Amount || !token2Amount) {
      toast({
        title: "Invalid Amounts",
        description: "Please enter valid amounts for both tokens.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has sufficient balance for both tokens
    const token1Balance = parseFloat(tokenBalances[selectedPairData?.token1 || ""] || "0");
    const token2Balance = parseFloat(tokenBalances[selectedPairData?.token2 || ""] || "0");
    const requestedToken1 = parseFloat(token1Amount);
    const requestedToken2 = parseFloat(token2Amount);
    
    if (requestedToken1 > token1Balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${selectedPairData?.token1}. Available: ${token1Balance.toFixed(6)}`,
        variant: "destructive",
      });
      return;
    }

    if (requestedToken2 > token2Balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${selectedPairData?.token2}. Available: ${token2Balance.toFixed(6)}`,
        variant: "destructive",
      });
      return;
    }

    setIsAddingLiquidity(true);
    
    try {
      toast({
        title: "Preparing Liquidity Addition",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Simulate Web3 liquidity addition transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Liquidity Added Successfully! 🎉",
        description: `Added ${token1Amount} ${selectedPairData?.token1} and ${token2Amount} ${selectedPairData?.token2} to the pool. Transaction: ${txHash.substring(0, 10)}...`,
      });
      
      setToken1Amount("");
      setToken2Amount("");
      await refreshBalances();
      
    } catch (error: any) {
      console.error('Add liquidity failed:', error);
      toast({
        title: "Add Liquidity Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  const handleRemoveLiquidity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to remove liquidity.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Polygon Amoy testnet to remove liquidity.",
        variant: "destructive",
      });
      return;
    }

    setIsRemovingLiquidity(true);
    
    try {
      toast({
        title: "Preparing Liquidity Removal",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Simulate Web3 liquidity removal transaction
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Liquidity Removed! 🎉",
        description: `Your liquidity has been successfully removed from the pool. Transaction: ${txHash.substring(0, 10)}...`,
      });

      await refreshBalances();
      
    } catch (error: any) {
      console.error('Remove liquidity failed:', error);
      toast({
        title: "Remove Liquidity Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemovingLiquidity(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Liquidity Pools</h2>
      <p className="text-muted-foreground mb-8">Provide liquidity to earn trading fees and rewards</p>
      
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Liquidity</TabsTrigger>
          <TabsTrigger value="remove">Remove Liquidity</TabsTrigger>
          <TabsTrigger value="pools">Pool Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Pools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Pools</h3>
              {liquidityPairs.map((pool) => (
                <Card 
                  key={pool.pair} 
                  className={`cursor-pointer transition-all ${selectedPair === pool.pair ? 'ring-2 ring-trustpurple-500' : ''}`}
                  onClick={() => setSelectedPair(pool.pair)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{pool.pair}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {pool.apy} APY
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">TVL</p>
                        <p className="font-medium">{pool.tvl}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">24h Volume</p>
                        <p className="font-medium">{pool.volume24h}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Add Liquidity Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add Liquidity</CardTitle>
                  <CardDescription>
                    {selectedPairData ? `Adding to ${selectedPairData.pair} pool` : 'Select a pool to add liquidity'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isWalletConnected ? (
                    <div className="text-center py-6">
                      <p className="mb-4 text-muted-foreground">Connect your wallet to add liquidity</p>
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
                    <form onSubmit={handleAddLiquidity} className="space-y-6">
                      <div>
                        <label htmlFor="token1-amount" className="block text-sm font-medium mb-2">
                          {selectedPairData?.token1} Amount
                        </label>
                        <div className="relative">
                          <Input
                            id="token1-amount"
                            type="number"
                            placeholder="0.00"
                            value={token1Amount}
                            onChange={(e) => setToken1Amount(e.target.value)}
                            className="pr-16"
                            step="0.000001"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">{selectedPairData?.token1}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Balance: {parseFloat(tokenBalances[selectedPairData?.token1 || ""] || "0").toFixed(6)} {selectedPairData?.token1}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <Plus className="mx-auto text-muted-foreground" size={20} />
                      </div>
                      
                      <div>
                        <label htmlFor="token2-amount" className="block text-sm font-medium mb-2">
                          {selectedPairData?.token2} Amount
                        </label>
                        <div className="relative">
                          <Input
                            id="token2-amount"
                            type="number"
                            placeholder="0.00"
                            value={token2Amount}
                            onChange={(e) => setToken2Amount(e.target.value)}
                            className="pr-16"
                            step="0.000001"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">{selectedPairData?.token2}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Balance: {parseFloat(tokenBalances[selectedPairData?.token2 || ""] || "0").toFixed(6)} {selectedPairData?.token2}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm bg-muted/40 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span>Pool Share:</span>
                          <span>0.001%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>APY:</span>
                          <span className="text-green-500 font-medium">{selectedPairData?.apy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. Rewards/Day:</span>
                          <span>0.05 {selectedPairData?.token1}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network Fee:</span>
                          <span>~0.001 MATIC</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                        disabled={isAddingLiquidity || !selectedPairData}
                      >
                        {isAddingLiquidity ? (
                          <>
                            <RefreshCw className="mr-2 animate-spin" size={18} />
                            Adding Liquidity...
                          </>
                        ) : (
                          "Add Liquidity"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="remove" className="space-y-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Remove Liquidity</CardTitle>
              <CardDescription>Withdraw your liquidity from pools</CardDescription>
            </CardHeader>
            <CardContent>
              {!isWalletConnected ? (
                <div className="text-center py-6">
                  <p className="mb-4 text-muted-foreground">Connect your wallet to remove liquidity</p>
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
                <div className="text-center py-6">
                  <Droplets className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">You have no liquidity positions</p>
                  <p className="text-sm text-muted-foreground mt-2">Add liquidity to start earning fees</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {liquidityPairs.map((pool) => (
              <Card key={pool.pair}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{pool.pair}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {pool.apy} APY
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Value Locked</p>
                      <p className="font-semibold text-lg">{pool.tvl}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">24h Volume</p>
                      <p className="font-semibold text-lg">{pool.volume24h}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Your Liquidity</span>
                      <span className="font-medium">${pool.yourLiquidity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Rewards</span>
                      <span className="font-medium text-green-500">$0.00/day</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedPair(pool.pair)}
                  >
                    <Plus className="mr-2" size={16} />
                    Add Liquidity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiquidityTab;
