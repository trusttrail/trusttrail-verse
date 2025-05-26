
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Droplets, Wallet, ExternalLink, Copy } from "lucide-react";
import Header from "@/components/Header";

const TestnetFaucet = () => {
  const { toast } = useToast();
  const { isWalletConnected, walletAddress, connectWallet } = useWalletConnection();
  const [customAddress, setCustomAddress] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");

  const handleRequestTokens = async () => {
    const targetAddress = customAddress || walletAddress;
    
    if (!targetAddress) {
      toast({
        title: "Address Required",
        description: "Please connect your wallet or enter an address manually.",
        variant: "destructive",
      });
      return;
    }

    // Validate address format
    if (!targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      });
      return;
    }

    setIsRequesting(true);

    try {
      // Simulate faucet request - in production this would call your smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction hash
      const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64);
      setLastTxHash(mockTxHash);
      
      toast({
        title: "Tokens Sent!",
        description: `10 $NOCAP test tokens have been sent to ${targetAddress.substring(0, 6)}...${targetAddress.substring(targetAddress.length - 4)}`,
      });
      
      setCustomAddress("");
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to send test tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 flex items-center justify-center mr-3">
                <Droplets size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold">Testnet Faucet</h1>
            </div>
            <p className="text-muted-foreground">
              Get 10 $NOCAP test tokens for testing platform features
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request Test Tokens</CardTitle>
              <CardDescription>
                Enter your wallet address to receive 10 $NOCAP test tokens. These tokens can be used for testing staking, swaps, liquidity provision, NFT purchases, and transaction signing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isWalletConnected && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Connected Wallet</p>
                      <p className="text-xs text-muted-foreground">{walletAddress}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyAddress}>
                      <Copy size={14} className="mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Wallet Address {!isWalletConnected && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    id="address"
                    placeholder={isWalletConnected ? "Leave empty to use connected wallet" : "0x..."}
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                {!isWalletConnected && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-muted"></div>
                    <span className="text-sm text-muted-foreground">OR</span>
                    <div className="flex-1 border-t border-muted"></div>
                  </div>
                )}

                {!isWalletConnected && (
                  <Button 
                    onClick={connectWallet} 
                    variant="outline" 
                    className="w-full"
                  >
                    <Wallet size={16} className="mr-2" />
                    Connect Wallet to Auto-fill Address
                  </Button>
                )}

                <Button 
                  onClick={handleRequestTokens} 
                  className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                  disabled={isRequesting}
                >
                  <Droplets size={16} className="mr-2" />
                  {isRequesting ? "Sending Tokens..." : "Request 10 $NOCAP Test Tokens"}
                </Button>
              </div>

              {lastTxHash && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">Transaction Successful</p>
                      <p className="text-xs text-green-600 dark:text-green-500 font-mono">{lastTxHash}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a 
                        href={`https://mumbai.polygonscan.com/tx/${lastTxHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Test tokens have no real value and are only for testing purposes</p>
                <p>• Limit: 10 tokens per address every 24 hours</p>
                <p>• Tokens are sent on Polygon Mumbai testnet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestnetFaucet;
