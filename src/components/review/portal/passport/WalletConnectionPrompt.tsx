
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface WalletConnectionPromptProps {
  connectWallet: () => void;
}

const WalletConnectionPrompt = ({ connectWallet }: WalletConnectionPromptProps) => {
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
};

export default WalletConnectionPrompt;
