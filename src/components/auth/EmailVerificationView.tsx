
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from 'lucide-react';
import VerificationTimer from '@/components/VerificationTimer';

interface EmailVerificationViewProps {
  email: string;
  walletAddress?: string;
  isWalletConnected: boolean;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const EmailVerificationView = ({ 
  email, 
  walletAddress, 
  isWalletConnected, 
  onResend, 
  onBack, 
  isLoading 
}: EmailVerificationViewProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail size={20} />
          Verify Your Email
        </CardTitle>
        <CardDescription>
          We've sent a verification link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
          <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            Please check your email <strong>{email}</strong> and click the verification link to activate your account.
          </p>
          {isWalletConnected && walletAddress && (
            <p className="text-xs text-green-600 mb-2">
              ✓ Wallet {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)} will be automatically linked after verification
            </p>
          )}
          <p className="text-xs text-gray-500">
            Don't forget to check your spam/junk folder if you don't see the email in your inbox.
          </p>
        </div>

        <VerificationTimer
          initialTime={60}
          onResend={onResend}
          isLoading={isLoading}
        />

        <div className="text-center">
          <Button
            variant="link"
            onClick={onBack}
            className="text-sm"
          >
            Back to sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationView;
