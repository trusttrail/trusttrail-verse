
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ExternalLink, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface PassportStatusCardProps {
  isVerified: boolean;
  isVerifying: boolean;
  passportScore: number;
  passportData: any;
  needsRefresh: boolean;
  onVerifyPassport: () => void;
  onRefreshPassport: () => void;
}

const PassportStatusCard = ({
  isVerified,
  isVerifying,
  passportScore,
  passportData,
  needsRefresh,
  onVerifyPassport,
  onRefreshPassport
}: PassportStatusCardProps) => {
  return (
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
                  ? 'Verifying your passport - complete stamps in the Gitcoin window...' 
                  : isVerified 
                    ? `Verified with score: ${passportScore.toFixed(2)} (Synced from Gitcoin Passport)` 
                    : 'Not verified - Connect to Gitcoin Passport to write reviews'
                }
              </p>
              {passportData && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last synced: {new Date(passportData.timestamp).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isVerified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Score: {passportScore.toFixed(2)}
              </Badge>
            )}
            {needsRefresh && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Needs Refresh
              </Badge>
            )}
            {isVerified ? (
              <Button 
                onClick={onRefreshPassport}
                variant="outline"
                disabled={isVerifying}
                className="flex items-center gap-2"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                {isVerifying ? 'Syncing...' : 'Refresh Score'}
              </Button>
            ) : (
              <Button 
                onClick={onVerifyPassport}
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

        {/* Instructions for verification */}
        {!isVerified && !isVerifying && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">How to get verified:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Click "Verify Identity" to open Gitcoin Passport dashboard</li>
                <li><strong>Connect the same wallet address</strong> you're using here</li>
                <li>Add stamps by connecting your social accounts (Twitter, Google, etc.)</li>
                <li>Wait for your score to build up in Gitcoin Passport</li>
                <li>Return here - your score will automatically sync</li>
              </ol>
            </div>
          </div>
        )}

        {/* Verification in progress */}
        {isVerifying && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Verification in progress</p>
              <p className="text-xs mt-1">
                Complete your verification in Gitcoin Passport: connect your wallet, add stamps, and wait for your score to appear. 
                We'll automatically sync your score once it's ready.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassportStatusCard;
