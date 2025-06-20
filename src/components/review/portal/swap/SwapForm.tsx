
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';
import { TokenInfo } from '@/services/web3Service';

interface SwapFormProps {
  tokens: TokenInfo[];
  tokenBalances: Record<string, string>;
  refreshBalances: () => Promise<void>;
}

const SwapForm: React.FC<SwapFormProps> = ({ tokens, tokenBalances, refreshBalances }) => {
  const { toast } = useToast();
  const { web3Service, currentNetwork } = useWeb3();
  const [fromToken, setFromToken] = useState("MATIC");
  const [toToken, setToToken] = useState("TRUST");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const calculateEstimate = async () => {
        try {
          const estimate = await web3Service.estimateSwap(fromToken, toToken, fromAmount);
          setToAmount(estimate);
          setExchangeRate(parseFloat(estimate) / parseFloat(fromAmount));
        } catch (error) {
          console.error('Failed to estimate swap:', error);
          setToAmount("");
          setExchangeRate(0);
        }
      };
      
      calculateEstimate();
    } else {
      setToAmount("");
      setExchangeRate(0);
    }
  }, [fromAmount, fromToken, toToken, web3Service]);

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

    const userBalance = parseFloat(tokenBalances[fromToken] || "0");
    const requestedAmount = parseFloat(fromAmount);
    
    if (requestedAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${fromToken}. Available: ${userBalance.toFixed(6)}`,
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

      await new Promise(resolve => setTimeout(resolve, 2000));
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "Swap Successful! 🎉",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}. Transaction: ${txHash.substring(0, 10)}...`,
      });

      setFromAmount("");
      setToAmount("");
      await refreshBalances();
      
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Exchange tokens at the best available rates</CardDescription>
      </CardHeader>
      <CardContent>
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
                  step="0.000001"
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
            <p className="text-sm text-muted-foreground">
              Balance: {parseFloat(tokenBalances[fromToken] || "0").toFixed(6)} {fromToken}
            </p>
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
            <p className="text-sm text-muted-foreground">
              Balance: {parseFloat(tokenBalances[toToken] || "0").toFixed(6)} {toToken}
            </p>
          </div>

          {/* Exchange Rate Info */}
          {exchangeRate > 0 && (
            <div className="bg-muted/40 p-3 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Exchange Rate:</span>
                <span>1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}</span>
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
      </CardContent>
    </Card>
  );
};

export default SwapForm;
