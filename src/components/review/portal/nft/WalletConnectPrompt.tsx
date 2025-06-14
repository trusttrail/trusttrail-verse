
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectPromptProps {
  connectWallet: () => void;
  message: string;
}

const WalletConnectPrompt = ({ connectWallet, message }: WalletConnectPromptProps) => {
  return (
    <div className="text-center py-12">
      <p className="mb-4 text-muted-foreground">{message}</p>
      <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
        <Wallet className="mr-2" size={18} />
        Connect Wallet
      </Button>
    </div>
  );
};

export default WalletConnectPrompt;
