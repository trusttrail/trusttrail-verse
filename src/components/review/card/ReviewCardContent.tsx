
import React from 'react';
import { CheckCircle, Shield } from "lucide-react";

interface ReviewCardContentProps {
  companyName: string;
  content: string;
  verified: boolean;
  gitcoinScore?: number;
  companyLogo?: string;
}

const ReviewCardContent = ({ companyName, content, verified, gitcoinScore, companyLogo }: ReviewCardContentProps) => {
  // Company logo mapping for fallback
  const getCompanyLogo = (name: string) => {
    const logoMap: { [key: string]: string } = {
      "QuickSwap": "https://pbs.twimg.com/profile_images/1673628171051331584/5Wf5ZMcF_400x400.jpg",
      "OpenSea": "https://pbs.twimg.com/profile_images/1560719020905521152/8KHPoIV-_400x400.jpg",
      "Axie Infinity": "https://pbs.twimg.com/profile_images/1598680199088066560/9J0QZQFX_400x400.png",
      "Uniswap": "https://pbs.twimg.com/profile_images/1692919071088746496/fWpUdRws_400x400.jpg",
      "SushiSwap": "https://pbs.twimg.com/profile_images/1756351012000231424/7hsDLRm3_400x400.jpg",
      "PancakeSwap": "https://pbs.twimg.com/profile_images/1677928725626437633/XHOxBFRD_400x400.jpg"
    };
    return logoMap[name] || companyLogo;
  };

  const displayLogo = companyLogo || getCompanyLogo(companyName);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2">
        <div className="flex items-center gap-2">
          {displayLogo && (
            <img 
              src={displayLogo} 
              alt={`${companyName} logo`}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="text-sm text-trustpurple-400 font-medium">{companyName}</span>
        </div>
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
