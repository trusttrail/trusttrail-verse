
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, CheckCircle } from "lucide-react";

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
  onLike: (nftId: number) => void;
  onBuy: (nft: NFT) => void;
}

const NFTGrid: React.FC<NFTGridProps> = ({ nfts, likedNFTs, onLike, onBuy }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-48 object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 ${likedNFTs.has(nft.id) ? 'text-red-500' : 'text-white'}`}
              onClick={() => onLike(nft.id)}
            >
              <Heart size={16} fill={likedNFTs.has(nft.id) ? "currentColor" : "none"} />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg truncate">{nft.name}</h3>
              {nft.verified && (
                <CheckCircle className="text-blue-500" size={16} />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">by {nft.creator}</p>
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary">{nft.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart size={12} />
                <span>{nft.likes}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{nft.price}</span>
              <Button 
                size="sm"
                onClick={() => onBuy(nft)}
                className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
              >
                <ShoppingCart size={16} className="mr-1" />
                Buy
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NFTGrid;
