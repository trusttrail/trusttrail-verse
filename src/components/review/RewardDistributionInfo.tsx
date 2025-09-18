import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Coins, CheckCircle } from 'lucide-react';

export const RewardDistributionInfo: React.FC = () => {
  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium text-sm">How TRST Token Rewards Work:</div>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Review submitted to blockchain securely</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-3 w-3 text-amber-500" />
              <span>10 TRST tokens distributed after moderator approval</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-3 w-3 text-blue-500" />
              <span>Additional rewards for upvotes from community</span>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};