
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const SwapInfoCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={20} />
          Swap Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <h4 className="font-medium mb-1">How it works:</h4>
          <p className="text-muted-foreground">Swaps are executed through automated market makers (AMMs) on Polygon Amoy testnet.</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Fees:</h4>
          <p className="text-muted-foreground">Small network fees apply for each transaction, payable in MATIC tokens.</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Slippage:</h4>
          <p className="text-muted-foreground">Price difference between when you submit and when the transaction is confirmed.</p>
        </div>
        <Badge variant="outline" className="w-fit">
          Testnet Only - Use Test Tokens
        </Badge>
      </CardContent>
    </Card>
  );
};

export default SwapInfoCard;
