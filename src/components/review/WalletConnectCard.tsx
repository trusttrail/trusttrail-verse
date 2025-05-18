
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlugZap } from "lucide-react";

interface WalletConnectCardProps {
  isMetaMaskAvailable: boolean;
  connectWallet: () => void;
  connectWithWalletConnect: () => void;
}

const WalletConnectCard = ({ 
  isMetaMaskAvailable, 
  connectWallet, 
  connectWithWalletConnect 
}: WalletConnectCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection Required</CardTitle>
        <CardDescription>
          Connect your wallet to sign and submit your review to the blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-3 justify-center">
        {isMetaMaskAvailable && (
          <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
            <Wallet className="mr-2" size={18} />
            Connect with MetaMask
          </Button>
        )}
        <Button 
          onClick={connectWithWalletConnect} 
          variant={isMetaMaskAvailable ? "outline" : "default"} 
          className={isMetaMaskAvailable ? "" : "bg-gradient-to-r from-trustpurple-500 to-trustblue-500"}
        >
          <PlugZap className="mr-2" size={18} />
          {isMetaMaskAvailable ? "Use WalletConnect" : "Connect Wallet"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletConnectCard;
