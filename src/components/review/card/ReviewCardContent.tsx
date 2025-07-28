
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
  // Company logo mapping using official sources (CoinMarketCap & Twitter)
  const getCompanyLogo = (name: string) => {
    const logoMap: { [key: string]: string } = {
      'Binance': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      'PancakeSwap': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
      'Ethereum': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
      'OpenSea': 'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png',
      'Dreamstarter.xyz': 'https://pbs.twimg.com/profile_images/1673628171051331584/5Wf5ZMcF_400x400.jpg',
      'Pump.fun': 'https://pbs.twimg.com/profile_images/1798409590515642368/uHoVg8EH_400x400.jpg',
      'Uniswap': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
      'Aave': 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
      'Compound': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
      'Solana': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
      'Cardano': 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
      'Polygon': 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
      'SushiSwap': 'https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png',
      'QuickSwap': 'https://pbs.twimg.com/profile_images/1673628171051331584/5Wf5ZMcF_400x400.jpg',
      'Axie Infinity': 'https://s2.coinmarketcap.com/static/img/coins/64x64/6783.png'
    };
    return logoMap[name] || companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff&size=32`;
  };

  const displayLogo = getCompanyLogo(companyName);

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
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=6366f1&color=ffffff&size=32`;
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
