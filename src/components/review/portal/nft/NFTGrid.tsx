
import React from 'react';
import NFTCard from './NFTCard';

interface NFT {
  id: number;
  name: string;
  price: string;
  image: string;
  creator: string;
  category: string;
  likes: number;
  verified: boolean;
}

interface NFTGridProps {
  nfts: NFT[];
  likedNFTs: Set<number>;
  onLike: (id: number) => void;
  onBuy: (nft: NFT) => void;
}

const NFTGrid = ({ nfts, likedNFTs, onLike, onBuy }: NFTGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          isLiked={likedNFTs.has(nft.id)}
          onLike={onLike}
          onBuy={onBuy}
        />
      ))}
    </div>
  );
};

export default NFTGrid;
