
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlugZap, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription>
          Sign in to your account to submit and manage reviews.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => navigate('/auth')} 
          className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
        >
          <LogIn className="mr-2" size={18} />
          Sign In / Create Account
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or connect wallet</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {isMetaMaskAvailable && (
            <Button onClick={connectWallet} variant="outline" className="flex-1">
              <Wallet className="mr-2" size={18} />
              Connect MetaMask
            </Button>
          )}
          <Button 
            onClick={connectWithWalletConnect} 
            variant="outline"
            className="flex-1"
          >
            <PlugZap className="mr-2" size={18} />
            WalletConnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnectCard;
