
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye } from "lucide-react";

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

interface NFTCardProps {
  nft: NFT;
  isLiked: boolean;
  onLike: (id: number) => void;
  onBuy: (nft: NFT) => void;
}

const NFTCard = ({ nft, isLiked, onLike, onBuy }: NFTCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onLike(nft.id)}
        >
          <Heart
            size={16}
            className={isLiked ? "fill-red-500 text-red-500" : ""}
          />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold truncate">{nft.name}</h3>
          {nft.verified && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Verified
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">by {nft.creator}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg">{nft.price}</span>
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-red-500" />
            <span className="text-sm text-muted-foreground">{nft.likes}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onBuy(nft)}
          >
            <Eye size={14} className="mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
            onClick={() => onBuy(nft)}
          >
            <ShoppingCart size={14} className="mr-1" />
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
