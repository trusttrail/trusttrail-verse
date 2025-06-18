
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Shield, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewPrerequisitesProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  isAuthenticated: boolean;
  existingUser: boolean | null;
  gitcoinVerified: boolean;
  passportScore: number;
  needsRefresh: boolean;
  isVerifying: boolean;
  handleVerifyGitcoin: () => void;
  handleRefreshGitcoin: () => void;
}

const ReviewPrerequisites = ({
  isWalletConnected,
  connectWallet,
  isAuthenticated,
  existingUser,
  gitcoinVerified,
  passportScore,
  needsRefresh,
  isVerifying,
  handleVerifyGitcoin,
  handleRefreshGitcoin,
}: ReviewPrerequisitesProps) => {
  // Determine authentication status display based on wallet connection state
  const getAuthStatus = () => {
    if (isAuthenticated) {
      return { text: "Wallet Connected", color: "text-emerald-600", icon: true };
    }
    
    if (isWalletConnected) {
      if (existingUser) {
        return { text: "Wallet Connected", color: "text-emerald-600", icon: true };
      }
    }
    
    return { text: "Connect Wallet Required", color: "text-gray-600", icon: false };
  };

  const authStatus = getAuthStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="text-trustpurple-500" size={20} />
          Review Prerequisites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Wallet Connection</span>
              {authStatus.icon && <CheckCircle className="text-emerald-500" size={16} />}
            </div>
            {!isWalletConnected && (
              <Button size="sm" variant="outline" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
            {isWalletConnected && (
              <span className="text-sm text-emerald-600">Connected</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Identity Verified</span>
              {isVerifying && <RefreshCw className="w-4 h-4 animate-spin text-yellow-500" />}
              {gitcoinVerified && !isVerifying && <CheckCircle className="text-emerald-500" size={16} />}
              {gitcoinVerified && passportScore >= 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Score: {passportScore.toFixed(1)}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {gitcoinVerified ? (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleRefreshGitcoin}
                  disabled={!isWalletConnected || isVerifying}
                  title="Refresh your Gitcoin Passport score"
                >
                  <RefreshCw size={14} className={isVerifying ? 'animate-spin' : ''} />
                  {isVerifying ? 'Refreshing...' : 'Refresh Score'}
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={handleVerifyGitcoin}
                  disabled={!isWalletConnected || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Identity"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Verification Status Alerts */}
        {isVerifying && (
          <Alert>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertDescription>
              <strong>Verification in progress:</strong> Complete your verification in the Gitcoin Passport window. 
              We'll automatically detect your score when ready. This may take a few minutes.
            </AlertDescription>
          </Alert>
        )}

        {gitcoinVerified && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              <strong>Identity Verified:</strong> You're all set! Your Gitcoin Passport score of {passportScore.toFixed(1)} 
              will be used for review verification. Use "Refresh Score" if you've added new stamps to update your score.
            </AlertDescription>
          </Alert>
        )}

        {!isWalletConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to start writing your review.
            </AlertDescription>
          </Alert>
        )}

        {isWalletConnected && !gitcoinVerified && !isVerifying && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Identity Verification Required:</strong> Complete identity verification to submit reviews and earn rewards. 
              Click "Verify Identity" to open Gitcoin Passport, connect your wallet, and complete the verification process.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewPrerequisites;
