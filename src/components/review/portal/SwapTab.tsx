
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Wallet, RefreshCw, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';

interface SwapTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const SwapTab = ({ isWalletConnected, connectWallet }: SwapTabProps) => {
  const { toast } = useToast();
  const { web3Service, currentNetwork } = useWeb3();
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("TRUST");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [slippage, setSlippage] = useState("0.5");

  const tokens = [
    { 
      symbol: "TRUST", 
      name: "Trust Token", 
      balance: "1,234.56",
      icon: "🔷",
      address: "0x186389f359713852366b4eA1eb9BC947f68F74ca"
    },
    { 
      symbol: "ETH", 
      name: "Ethereum", 
      balance: "2.45",
      icon: "⟠",
      address: "0x0000000000000000000000000000000000000000"
    },
    { 
      symbol: "BTC", 
      name: "Bitcoin", 
      balance: "0.12",
      icon: "₿",
      address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
    },
    { 
      symbol: "USDT", 
      name: "Tether USD", 
      balance: "5,678.90",
      icon: "💚",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    },
    { 
      symbol: "USDC", 
      name: "USD Coin", 
      balance: "3,456.78",
      icon: "🔵",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    }
  ];

  const fromTokenData = tokens.find(t => t.symbol === fromToken);
  const toTokenData = tokens.find(t => t.symbol === toToken);

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      // Mock exchange rates (in real implementation, fetch from DEX)
      const rates: Record<string, Record<string, number>> = {
        ETH: { TRUST: 1200, BTC: 0.065, USDT: 2500, USDC: 2500 },
        TRUST: { ETH: 0.00083, BTC: 0.000054, USDT: 2.08, USDC: 2.08 },
        BTC: { ETH: 15.4, TRUST: 18500, USDT: 38500, USDC: 38500 },
        USDT: { ETH: 0.0004, TRUST: 0.48, BTC: 0.000026, USDC: 1.0 },
        USDC: { ETH: 0.0004, TRUST: 0.48, BTC: 0.000026, USDT: 1.0 }
      };

      const rate = rates[fromToken]?.[toToken] || 1;
      setExchangeRate(rate);
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    } else {
      setToAmount("");
      setExchangeRate(0);
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your MetaMask wallet to perform swaps.",
        variant: "destructive",
      });
      return;
    }

    if (currentNetwork !== "amoy") {
      toast({
        title: "Wrong Network",
        description: "Please switch to Polygon Amoy testnet to perform swaps.",
        variant: "destructive",
      });
      return;
    }

    if (!fromAmount || !toAmount) {
      toast({
        title: "Invalid Amounts",
        description: "Please enter valid amounts for both tokens.",
        variant: "destructive",
      });
      return;
    }

    setIsSwapping(true);
    
    try {
      toast({
        title: "Preparing Swap",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Simulate Web3 swap transaction
      // In real implementation, this would interact with a DEX smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Swap Successful! 🎉",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}. Transaction: ${txHash.substring(0, 10)}...`,
      });

      // Reset form
      setFromAmount("");
      setToAmount("");
      
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast({
        title: "Swap Failed",
        description: error.message || "Swap transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const isValidNetwork = currentNetwork === "amoy";

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Token Swap</h2>
      <p className="text-muted-foreground mb-8">Swap tokens instantly on Polygon Amoy testnet</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swap Interface */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>Exchange tokens at the best available rates</CardDescription>
            </CardHeader>
            <CardContent>
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
                <form onSubmit={handleSwap} className="space-y-6">
                  {/* From Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <Select value={fromToken} onValueChange={setFromToken}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center gap-2">
                                <span>{token.icon}</span>
                                <span>{token.symbol}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {fromTokenData && (
                      <p className="text-sm text-muted-foreground">
                        Balance: {fromTokenData.balance} {fromTokenData.symbol}
                      </p>
                    )}
                  </div>

                  {/* Swap Direction Button */}
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSwapTokens}
                      className="rounded-full p-2"
                    >
                      <ArrowUpDown size={16} />
                    </Button>
                  </div>

                  {/* To Token */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={toAmount}
                          readOnly
                          className="text-lg bg-muted/40"
                        />
                      </div>
                      <Select value={toToken} onValueChange={setToToken}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tokens.filter(t => t.symbol !== fromToken).map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center gap-2">
                                <span>{token.icon}</span>
                                <span>{token.symbol}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {toTokenData && (
                      <p className="text-sm text-muted-foreground">
                        Balance: {toTokenData.balance} {toTokenData.symbol}
                      </p>
                    )}
                  </div>

                  {/* Exchange Rate Info */}
                  {exchangeRate > 0 && (
                    <div className="bg-muted/40 p-3 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Exchange Rate:</span>
                        <span>1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Slippage Tolerance:</span>
                        <span>{slippage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Fee:</span>
                        <span>~0.001 MATIC</span>
                      </div>
                    </div>
                  )}

                  {/* Slippage Settings */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slippage Tolerance (%)</label>
                    <div className="flex gap-2">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                        >
                          {value}%
                        </Button>
                      ))}
                      <Input
                        type="number"
                        placeholder="Custom"
                        value={slippage}
                        onChange={(e) => setSlippage(e.target.value)}
                        className="w-20 text-sm"
                        step="0.1"
                        min="0.1"
                        max="50"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full"
                    disabled={isSwapping || !fromAmount || !toAmount}
                  >
                    {isSwapping ? (
                      <>
                        <RefreshCw className="mr-2 animate-spin" size={18} />
                        Swapping...
                      </>
                    ) : (
                      `Swap ${fromToken} for ${toToken}`
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Token Balances & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Balances</CardTitle>
              <CardDescription>Your current token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{token.icon}</span>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{token.balance}</p>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={20} />
                Swap Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">How it works:</h4>
                <p className="text-muted-foreground">Swaps are executed through automated market makers (AMMs) on Polygon Amoy testnet.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Fees:</h4>
                <p className="text-muted-foreground">Small network fees apply for each transaction, payable in MATIC tokens.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Slippage:</h4>
                <p className="text-muted-foreground">Price difference between when you submit and when the transaction is confirmed.</p>
              </div>
              <Badge variant="outline" className="w-fit">
                Testnet Only - Use Test Tokens
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SwapTab;
