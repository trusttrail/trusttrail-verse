
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

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
    </>
  );
};

export default PassportInstructions;
