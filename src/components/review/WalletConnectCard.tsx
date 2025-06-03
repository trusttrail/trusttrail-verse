
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Wallet, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWalletConnection } from '@/hooks/useWalletConnection';

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
  const { needsSignup, existingUser } = useWalletConnection();

  const handleAuthRedirect = () => {
    console.log('Redirecting to auth page');
    navigate('/auth');
  };

  if (!isWalletConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to get started. We'll check if you have an existing account or help you create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Connect your wallet first to continue. We'll automatically detect if you're a new or existing user.
            </p>
            <div className="space-y-2">
              {isMetaMaskAvailable ? (
                <Button onClick={connectWallet} className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                  <Wallet className="mr-2" size={18} />
                  Connect MetaMask
                </Button>
              ) : (
                <Button 
                  onClick={() => window.open("https://metamask.io/download/", "_blank")}
                  variant="outline"
                  className="w-full"
                >
                  Install MetaMask
                </Button>
              )}
              <Button onClick={connectWithWalletConnect} variant="outline" className="w-full">
                <Wallet className="mr-2" size={18} />
                WalletConnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {needsSignup ? "Create Your Account" : existingUser ? "Welcome Back" : "Authentication Required"}
        </CardTitle>
        <CardDescription>
          Wallet connected ({walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}). 
          {needsSignup 
            ? " Create an account to link this new wallet and start writing reviews."
            : existingUser 
              ? " Sign in to continue with your existing account."
              : " Complete authentication to submit and manage reviews."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {needsSignup && (
          <div className="p-4 border-2 border-dashed border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <UserPlus size={16} />
              <span className="text-sm font-medium">New Wallet Detected</span>
            </div>
            <p className="text-xs text-green-600">
              This wallet isn't linked to any account yet. Create an account to get started!
            </p>
          </div>
        )}
        
        {existingUser && (
          <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <LogIn size={16} />
              <span className="text-sm font-medium">Wallet Recognized</span>
            </div>
            <p className="text-xs text-blue-600">
              This wallet is linked to an existing account. Sign in to continue!
            </p>
          </div>
        )}

        <Button 
          onClick={handleAuthRedirect} 
          className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
        >
          {needsSignup ? (
            <>
              <UserPlus className="mr-2" size={18} />
              Create Account
            </>
          ) : (
            <>
              <LogIn className="mr-2" size={18} />
              Sign In
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletConnectCard;
