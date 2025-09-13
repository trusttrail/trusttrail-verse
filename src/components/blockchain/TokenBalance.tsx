
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, RefreshCw } from "lucide-react";
import { useWeb3 } from '@/hooks/useWeb3';

export const TokenBalance: React.FC = () => {
  const { tokenBalances, refreshBalances, isLoading, address, currentNetwork } = useWeb3();

  if (!address || !["amoy", "opSepolia"].includes(currentNetwork)) {
    return null;
  }

  // Get the correct token symbol for each network
  const tokenSymbol = currentNetwork === "amoy" ? "TRT" : "TRUST";
  const tokenBalance = tokenBalances[tokenSymbol] || "0";
  const networkName = currentNetwork === "amoy" ? "Polygon Amoy" : "OP Sepolia";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          {tokenSymbol} Token Balance
        </CardTitle>
        <CardDescription>
          Your TRUSTTRAIL platform reward tokens on {networkName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{parseFloat(tokenBalance).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{tokenSymbol}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshBalances}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Earn tokens by writing quality reviews</p>
          <p>• Get bonus tokens when your reviews are upvoted</p>
          <p>• Participate in platform governance</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenBalance;
