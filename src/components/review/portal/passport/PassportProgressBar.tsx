
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface PassportProgressBarProps {
  passportScore: number;
  isVerified: boolean;
}

const PassportProgressBar = ({ passportScore, isVerified }: PassportProgressBarProps) => {
  if (!isVerified) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Passport Score</span>
        <span>{passportScore}/100</span>
      </div>
      <Progress value={passportScore} className="h-2" />
      <p className="text-xs text-muted-foreground">
        Higher scores indicate stronger identity verification. Your score is permanently linked to your account.
      </p>
    </div>
  );
};

export default PassportProgressBar;
