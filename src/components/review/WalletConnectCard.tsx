
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WalletConnectCardProps {
  isMetaMaskAvailable: boolean;
  connectWallet: () => void;
  connectWithWalletConnect: () => void;
  isWalletConnected: boolean;
  walletAddress: string;
}

const WalletConnectCard = ({ 
  isMetaMaskAvailable, 
  connectWallet, 
  connectWithWalletConnect,
  isWalletConnected,
  walletAddress
}: WalletConnectCardProps) => {
  const navigate = useNavigate();

  const handleAuthRedirect = () => {
    console.log('Redirecting to auth page');
    navigate('/auth');
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connection Required</CardTitle>
          <CardDescription>
            Please connect your wallet first from the top right corner, then proceed to sign in or create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">
              Connect your wallet using the "Connect Wallet" button in the top navigation bar to continue.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription>
          Wallet connected ({walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}). 
          Now sign in to your account to submit and manage reviews.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleAuthRedirect} 
          className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
        >
          <LogIn className="mr-2" size={18} />
          Sign In / Create Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletConnectCard;
