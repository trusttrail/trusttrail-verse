
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Filter, ShoppingCart, Wallet, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NFTMarketplaceTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const NFTMarketplaceTab = ({ isWalletConnected, connectWallet }: NFTMarketplaceTabProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [likedNFTs, setLikedNFTs] = useState<Set<number>>(new Set());

  const mockNFTs = [
    {
      id: 1,
      name: "Crypto Punk #1234",
      price: "2.5 ETH",
      image: "/placeholder.svg",
      creator: "0x1234...5678",
      category: "Art",
      likes: 45,
      verified: true
    },
    {
      id: 2,
      name: "Bored Ape #5678",
      price: "1.8 ETH",
      image: "/placeholder.svg",
      creator: "0x8765...4321",
      category: "Art",
      likes: 89,
      verified: true
    },
    {
      id: 3,
      name: "Cool Cat #9012",
      price: "0.5 ETH",
      image: "/placeholder.svg",
      creator: "0xabcd...ef12",
      category: "Art",
      likes: 23,
      verified: false
    },
    {
      id: 4,
      name: "Rare Gaming Item",
      price: "0.3 ETH",
      image: "/placeholder.svg",
      creator: "0xdef1...2345",
      category: "Gaming",
      likes: 67,
      verified: true
    }
  ];

  const handleLike = (nftId: number) => {
    setLikedNFTs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nftId)) {
        newSet.delete(nftId);
      } else {
        newSet.add(nftId);
      }
      return newSet;
    });
  };

  const handleBuy = (nft: any) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to purchase NFTs.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase Initiated",
      description: `Purchasing ${nft.name} for ${nft.price}`,
    });
  };

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || nft.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">NFT Marketplace</h2>
      <p className="text-muted-foreground mb-8">Discover, collect, and trade unique digital assets</p>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="art">Art</SelectItem>
            <SelectItem value="gaming">Gaming</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    onClick={() => handleLike(nft.id)}
                  >
                    <Heart
                      size={16}
                      className={likedNFTs.has(nft.id) ? "fill-red-500 text-red-500" : ""}
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
                      onClick={() => handleBuy(nft)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                      onClick={() => handleBuy(nft)}
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my-nfts" className="mt-6">
          {!isWalletConnected ? (
            <div className="text-center py-12">
              <p className="mb-4 text-muted-foreground">Connect your wallet to view your NFTs</p>
              <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                <Wallet className="mr-2" size={18} />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You don't own any NFTs yet</p>
              <p className="text-sm text-muted-foreground mt-2">Browse the marketplace to find amazing NFTs</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          {!isWalletConnected ? (
            <div className="text-center py-12">
              <p className="mb-4 text-muted-foreground">Connect your wallet to create NFTs</p>
              <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                <Wallet className="mr-2" size={18} />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create NFT</CardTitle>
                <CardDescription>Upload and mint your digital creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Drag and drop or click to upload</p>
                    <p className="text-sm text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="nft-name" className="block text-sm font-medium mb-2">Name</label>
                  <Input id="nft-name" placeholder="Enter NFT name" />
                </div>
                <div>
                  <label htmlFor="nft-description" className="block text-sm font-medium mb-2">Description</label>
                  <Input id="nft-description" placeholder="Describe your NFT" />
                </div>
                <div>
                  <label htmlFor="nft-price" className="block text-sm font-medium mb-2">Price (ETH)</label>
                  <Input id="nft-price" type="number" placeholder="0.00" />
                </div>
                <Button className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
                  Create NFT
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTMarketplaceTab;
