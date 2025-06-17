
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
              <li>Click "Verify Identity" to open Gitcoin Passport dashboard</li>
              <li><strong>Connect the exact same wallet address</strong> you're using on TrustTrail</li>
              <li>Complete stamp verification by connecting your accounts (Twitter, Google, etc.)</li>
              <li>Wait for your score to build up (this may take a few minutes)</li>
              <li>Your score will be automatically synced back to TrustTrail</li>
            </ol>
            <p className="mt-2 text-sm font-medium text-blue-600">
              <strong>Critical:</strong> You must use the same wallet address on both platforms for score syncing to work.
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
            <br/>
            <strong>Steps to complete:</strong>
            <ol className="list-decimal list-inside mt-1 text-sm">
              <li>Connect your wallet in the Gitcoin Passport dashboard</li>
              <li>Add and verify stamps (Twitter, Google, GitHub, etc.)</li>
              <li>Wait for your score to calculate and appear</li>
              <li>Close the window - we'll automatically detect your score</li>
            </ol>
            <p className="mt-2 text-sm">This process may take several minutes. Your score will sync automatically once completed.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Refresh needed alert */}
      {needsRefresh && isVerified && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Score Update Available:</strong> Your Gitcoin Passport score may be outdated. 
            Click "Refresh Score" to get the latest verification status from Gitcoin Passport for accurate reward calculations.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default PassportInstructions;
