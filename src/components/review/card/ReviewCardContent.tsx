
import React from 'react';
import { CheckCircle, Shield } from "lucide-react";

interface ReviewCardContentProps {
  companyName: string;
  content: string;
  verified: boolean;
  gitcoinScore?: number;
}

const ReviewCardContent = ({ companyName, content, verified, gitcoinScore }: ReviewCardContentProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2">
        <span className="text-sm text-trustpurple-400 font-medium">{companyName}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {verified && (
            <div className="flex items-center text-xs text-emerald-600">
              <CheckCircle size={12} className="mr-1" />
              <span className="hidden sm:inline">Verified Review</span>
              <span className="sm:hidden">Verified</span>
            </div>
          )}
          {gitcoinScore !== undefined && gitcoinScore !== null && (
            <div className="flex items-center text-xs text-blue-600">
              <Shield size={12} className="mr-1" />
              <span>Gitcoin: {gitcoinScore.toFixed(1)}/100</span>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{content}</p>
    </>
  );
};

export default ReviewCardContent;
