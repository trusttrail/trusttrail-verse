
import React from 'react';

interface NFTMarketplaceTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const NFTMarketplaceTab = ({ isWalletConnected, connectWallet }: NFTMarketplaceTabProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">NFT Marketplace</h2>
      <div className="text-6xl mb-6">🚧</div>
      <p className="text-xl font-semibold text-muted-foreground mb-2">Coming Soon</p>
      <p className="text-muted-foreground max-w-md">
        We're working hard to bring you an amazing NFT marketplace experience. Stay tuned for updates!
      </p>
    </div>
  );
};

export default NFTMarketplaceTab;
