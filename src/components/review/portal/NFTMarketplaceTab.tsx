
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import NFTSearchAndFilters from './nft/NFTSearchAndFilters';
import NFTGrid from './nft/NFTGrid';
import NFTCreateForm from './nft/NFTCreateForm';
import WalletConnectPrompt from './nft/WalletConnectPrompt';

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
      
      <NFTSearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <Tabs defaultValue="browse" className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <NFTGrid
            nfts={filteredNFTs}
            likedNFTs={likedNFTs}
            onLike={handleLike}
            onBuy={handleBuy}
          />
        </TabsContent>
        
        <TabsContent value="my-nfts" className="mt-6">
          {!isWalletConnected ? (
            <WalletConnectPrompt
              connectWallet={connectWallet}
              message="Connect your wallet to view your NFTs"
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You don't own any NFTs yet</p>
              <p className="text-sm text-muted-foreground mt-2">Browse the marketplace to find amazing NFTs</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          {!isWalletConnected ? (
            <WalletConnectPrompt
              connectWallet={connectWallet}
              message="Connect your wallet to create NFTs"
            />
          ) : (
            <NFTCreateForm />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTMarketplaceTab;
