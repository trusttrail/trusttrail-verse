
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, ExternalLink, Award, TrendingUp, Star, Coins, BarChart3, Trophy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useGitcoinPassport } from '@/hooks/useGitcoinPassport';
import { useWalletConnection } from '@/hooks/useWalletConnection';

interface PassportTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const PassportTab = ({ isWalletConnected, connectWallet }: PassportTabProps) => {
  const { toast } = useToast();
  const { walletAddress } = useWalletConnection();
  const { passportData, isVerified, passportScore, verifyPassport } = useGitcoinPassport();
  
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

    const success = await verifyPassport(walletAddress);
    
    if (success) {
      toast({
        title: "Passport Verification Started",
        description: "Please complete verification in the opened window. Your score will be captured automatically.",
      });
      
      // Show success toast after verification completes
      setTimeout(() => {
        toast({
          title: "Gitcoin Passport Verified!",
          description: `Your passport has been verified and will remain linked to your account.`,
        });
      }, 5500);
    } else {
      toast({
        title: "Verification Failed",
        description: "Failed to start passport verification. Please try again.",
        variant: "destructive",
      });
    }
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
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div>
                <p className="font-medium">Passport Status</p>
                <p className="text-sm text-muted-foreground">
                  {isVerified 
                    ? `Verified with score: ${passportScore} (Permanently linked to your account)` 
                    : 'Not verified - Verification will be remembered for your account'
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
              <Button 
                onClick={handleVerifyPassport}
                variant={isVerified ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                {isVerified ? "Update Score" : "Verify Identity"}
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>
          
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
