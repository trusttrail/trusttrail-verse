
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

interface PassportInstructionsProps {
  isVerified: boolean;
  isVerifying: boolean;
  needsRefresh: boolean;
}

const PassportInstructions = ({ isVerified, isVerifying, needsRefresh }: PassportInstructionsProps) => {
  return (
    <>
      {/* Instructions for verification */}
      {!isVerified && !isVerifying && (
        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription>
            <strong>How to verify your Gitcoin Passport:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Click "Verify Identity" to open Gitcoin Passport in a new window</li>
              <li>Connect the same wallet address you're using on TrustTrail</li>
              <li>Complete stamp verification to build your trust score</li>
              <li>Your score will be automatically synced back to TrustTrail</li>
            </ol>
            <p className="mt-2 text-sm">
              <strong>Important:</strong> Use the same wallet address for both TrustTrail and Gitcoin Passport.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Verification in progress */}
      {isVerifying && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <strong>Verification in progress:</strong> Complete your verification in the Gitcoin Passport window. 
            Connect your wallet, complete the stamps verification process, and return here. 
            Your score will be automatically detected and saved to your account. This may take a few minutes.
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
    </>
  );
};

export default PassportInstructions;
