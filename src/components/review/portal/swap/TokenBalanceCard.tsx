
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { TokenInfo } from '@/services/web3Service';

interface TokenBalanceCardProps {
  tokens: TokenInfo[];
  tokenBalances: Record<string, string>;
  refreshBalances: () => Promise<void>;
  isWalletConnected: boolean;
  isValidNetwork: boolean;
}

const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({
  tokens,
  tokenBalances,
  refreshBalances,
  isWalletConnected,
  isValidNetwork
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Token Balances
          <Button
            variant="outline"
            size="sm"
            onClick={refreshBalances}
            disabled={!isWalletConnected}
          >
            <RefreshCw size={16} />
          </Button>
        </CardTitle>
        <CardDescription>Your current token holdings on Polygon Amoy</CardDescription>
      </CardHeader>
      <CardContent>
        {!isWalletConnected ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Connect wallet to view balances</p>
          </div>
        ) : !isValidNetwork ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Switch to Polygon Amoy to view balances</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{token.icon}</span>
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-sm text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{parseFloat(tokenBalances[token.symbol] || "0").toFixed(6)}</p>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenBalanceCard;
