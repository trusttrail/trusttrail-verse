
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Wallet } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface SignUpPromptProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  needsSignup: boolean;
}

const SignUpPrompt = ({ isWalletConnected, connectWallet, needsSignup }: SignUpPromptProps) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  // Show the prompt if wallet is connected but user is not authenticated, or if needsSignup is true
  if (!isWalletConnected && !needsSignup) return null;

  return (
    <Card className="mb-6 border-trustpurple-200 bg-gradient-to-r from-trustpurple-50 to-trustblue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-trustpurple-700">
          <UserPlus size={20} />
          {!isWalletConnected ? 'Connect Wallet to Get Started' : 'Create Your Account'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {!isWalletConnected 
            ? 'Connect your wallet first to start writing reviews and earning rewards.'
            : 'Your wallet is connected. Create an account to start writing reviews and earning rewards.'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {!isWalletConnected ? (
            <Button onClick={connectWallet} className="flex items-center gap-2">
              <Wallet size={16} />
              Connect Wallet First
            </Button>
          ) : (
            <Button onClick={handleSignUp} className="flex items-center gap-2">
              <UserPlus size={16} />
              Create Account
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpPrompt;
