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
                  ? 'Syncing passport data - you can close the Gitcoin window at any time...' 
                  : isVerified 
                    ? `Synced with score: ${passportScore.toFixed(2)} ${passportScore === 0 ? '(You can improve this by adding stamps in Gitcoin Passport)' : ''}` 
                    : 'Not synced - Connect to view and sync your current Gitcoin Passport score'
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
              <Badge variant="secondary" className={`${passportScore === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
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
                {isVerifying ? 'Syncing...' : 'Sync Passport'}
              </Button>
            )}
          </div>
        </div>

        {/* Instructions for verification */}
        {!isVerified && !isVerifying && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">How to sync your passport:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Click "Sync Passport" to open Gitcoin Passport dashboard</li>
                <li><strong>Connect the same wallet address</strong> you're using here</li>
                <li>View your current score or add more stamps to improve it</li>
                <li>Close the window - your current score will automatically sync to TrustTrail</li>
              </ol>
            </div>
          </div>
        )}

        {/* Verification in progress */}
        {isVerifying && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Syncing your passport data</p>
              <p className="text-xs mt-1">
                We're checking your current Gitcoin Passport score. You can close the Gitcoin window at any time - 
                we'll automatically sync whatever score you currently have (including 0 if you haven't added stamps yet).
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassportStatusCard;
