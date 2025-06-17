
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, ExternalLink, Award, TrendingUp, Star, Coins, BarChart3, Trophy, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PassportTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const PassportTab = ({ isWalletConnected, connectWallet }: PassportTabProps) => {
  const { toast } = useToast();
  const { walletAddress } = useWalletConnection();
  const { 
    passportData, 
    isVerified, 
    passportScore, 
    needsRefresh,
    isVerifying,
    verifyPassport, 
    refreshPassportScore 
  } = useGitcoinPassport();
  
  const [userStats] = useState({
    reviewsGiven: 12,
    topUpvotedReview: "Amazing DeFi experience with QuickSwap",
    nocapEarned: 245.78,
    reputationScore: 8.5
  });

  const handleVerifyPassport = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first before verifying your passport.",
        variant: "destructive",
      });
      return;
    }

    await verifyPassport(walletAddress);
  };

  const handleRefreshPassport = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first before refreshing your passport.",
        variant: "destructive",
      });
      return;
    }

    await refreshPassportScore(walletAddress);
  };

  if (!isWalletConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield size={64} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Connect your wallet to access Gitcoin Passport verification and view your dashboard
            </p>
            <Button onClick={connectWallet}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Gitcoin Passport & Dashboard</h1>
        <p className="text-muted-foreground">
          Verify your identity and track your TrustTrail journey
        </p>
      </div>

      {/* Passport Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-trustpurple-500" size={24} />
            Gitcoin Passport Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Indicator */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                isVerifying ? 'bg-yellow-500 animate-pulse' : 
                isVerified ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div>
                <p className="font-medium flex items-center gap-2">
                  Passport Status
                  {isVerifying && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isVerifying 
                    ? 'Verifying your passport...' 
                    : isVerified 
                      ? `Verified with score: ${passportScore} (Permanently linked to your account)` 
                      : 'Not verified - Complete verification to write reviews'
                  }
                </p>
                {passportData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last verified: {new Date(passportData.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Score: {passportScore}
                </Badge>
              )}
              {needsRefresh && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Needs Refresh
                </Badge>
              )}
              {isVerified ? (
                <Button 
                  onClick={handleRefreshPassport}
                  variant="outline"
                  disabled={isVerifying}
                  className="flex items-center gap-2"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  {isVerifying ? 'Refreshing...' : 'Refresh Score'}
                </Button>
              ) : (
                <Button 
                  onClick={handleVerifyPassport}
                  disabled={isVerifying}
                  className="flex items-center gap-2"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  {isVerifying ? 'Verifying...' : 'Verify Identity'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {isVerified && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Passport Score</span>
                <span>{passportScore}/100</span>
              </div>
              <Progress value={passportScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Higher scores indicate stronger identity verification. Your score is permanently linked to your account.
              </p>
            </div>
          )}

          {/* Instructions for verification */}
          {!isVerified && !isVerifying && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>How to verify:</strong> Click "Verify Identity" to open Gitcoin Passport. 
                Connect your wallet, complete the stamps verification process, and return here. 
                Your score will be automatically detected and saved to your account.
              </AlertDescription>
            </Alert>
          )}

          {/* Verification in progress */}
          {isVerifying && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <strong>Verification in progress:</strong> Complete your verification in the Gitcoin Passport window. 
                We'll automatically detect your score when ready. This may take a few minutes.
              </AlertDescription>
            </Alert>
          )}

          {/* Refresh needed alert */}
          {needsRefresh && isVerified && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Score Update Available:</strong> Your Gitcoin Passport score may be outdated. 
                Click "Refresh Score" to get the latest verification status for accurate reward calculations.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* User Dashboard */}
      {isVerified && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reviews Given</p>
                  <p className="text-2xl font-bold">{userStats.reviewsGiven}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                  <Star className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">$NOCAP Earned</p>
                  <p className="text-2xl font-bold">{userStats.nocapEarned}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                  <Coins className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reputation Score</p>
                  <p className="text-2xl font-bold">{userStats.reputationScore}/10</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                  <Trophy className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Passport Score</p>
                  <p className="text-2xl font-bold">{passportScore}/100</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                  <Shield className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Review & Analytics */}
      {isVerified && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                Top Upvoted Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium mb-2">{userStats.topUpvotedReview}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    5/5 Rating
                  </span>
                  <span>42 Upvotes</span>
                  <span>QuickSwap</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-blue-500" size={20} />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month's Reviews</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg. Rating Given</span>
                <span className="font-semibold">4.2/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Community Impact</span>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="font-semibold text-green-600">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PassportTab;
