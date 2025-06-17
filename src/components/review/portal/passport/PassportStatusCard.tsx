
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ExternalLink, RefreshCw, CheckCircle } from "lucide-react";

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
                {isVerifying ? 'Refreshing...' : 'Refresh Score'}
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
      </CardContent>
    </Card>
  );
};

export default PassportStatusCard;
