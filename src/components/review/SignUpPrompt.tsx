
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Wallet, LogIn } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SignUpPromptProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  needsSignup: boolean;
  existingUser: boolean;
}

const SignUpPrompt = ({ isWalletConnected, connectWallet, needsSignup, existingUser }: SignUpPromptProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate('/auth');
  };

  console.log('SignUpPrompt render:', { 
    isAuthenticated, 
    hasUser: !!user, 
    isWalletConnected, 
    needsSignup, 
    existingUser 
  });

  // CRITICAL: Do not show the prompt if the user is already authenticated
  if (isAuthenticated && user) {
    console.log('✅ User is authenticated, hiding SignUpPrompt');
    return null;
  }

  // Only show if wallet is connected and user needs to take action
  if (!isWalletConnected) {
    console.log('❌ Wallet not connected, hiding SignUpPrompt');
    return null;
  }

  // Only show if user needs signup OR is existing user (both require auth action)
  if (!needsSignup && !existingUser) {
    console.log('❌ No auth action needed, hiding SignUpPrompt');
    return null;
  }

  console.log('✅ Showing SignUpPrompt for:', needsSignup ? 'new user' : 'existing user');

  return (
    <Card className="mb-6 border-trustpurple-200 bg-gradient-to-r from-trustpurple-50 to-trustblue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-trustpurple-700">
          {needsSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
          {needsSignup ? 'Create Your Account' : 'Welcome Back!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2 text-green-600">
          <Wallet size={16} />
          <span className="text-sm">
            Wallet Connected
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {needsSignup 
            ? 'Your wallet is new to our platform. Create an account to start writing reviews and earning rewards.'
            : 'Your wallet is linked to an existing account. Please sign in to continue.'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleAuthAction} className="flex items-center gap-2">
            {needsSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
            {needsSignup ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpPrompt;
