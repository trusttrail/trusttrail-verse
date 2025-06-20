
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from '@/hooks/useWeb3';
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
  const { currentNetwork, tokenBalances, refreshBalances } = useWeb3();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [likedNFTs, setLikedNFTs] = useState<Set<number>>(new Set());

  const mockNFTs = [
    {
      id: 1,
      name: "Crypto Punk #1234",
      price: "2.5 MATIC",
      image: "/placeholder.svg",
      creator: "0x1234...5678",
      category: "Art",
      likes: 45,
      verified: true
    },
    {
      id: 2,
      name: "Bored Ape #5678",
      price: "1.8 MATIC",
      image: "/placeholder.svg",
      creator: "0x8765...4321",
      category: "Art",
      likes: 89,
      verified: true
    },
    {
      id: 3,
      name: "Cool Cat #9012",
      price: "0.5 MATIC",
      image: "/placeholder.svg",
      creator: "0xabcd...ef12",
      category: "Art",
      likes: 23,
      verified: false
    },
    {
      id: 4,
      name: "Rare Gaming Item",
      price: "0.3 MATIC",
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

  const handleBuy = async (nft: any) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to purchase NFTs.",
        variant: "destructive",
      });
      return;
    }

    if (currentNetwork !== "amoy") {
      toast({
        title: "Wrong Network",
        description: "Please switch to Polygon Amoy testnet to purchase NFTs.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has sufficient MATIC balance
    const priceInMatic = parseFloat(nft.price.replace(" MATIC", ""));
    const userBalance = parseFloat(tokenBalances["MATIC"] || "0");
    
    if (priceInMatic > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${priceInMatic} MATIC but only have ${userBalance.toFixed(6)} MATIC.`,
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Preparing Purchase",
        description: "Please confirm the transaction in your MetaMask wallet...",
      });

      // Simulate Web3 NFT purchase transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      toast({
        title: "NFT Purchase Successful! 🎉",
        description: `Successfully purchased ${nft.name} for ${nft.price}. Transaction: ${txHash.substring(0, 10)}...`,
      });

      await refreshBalances();
      
    } catch (error: any) {
      console.error('NFT purchase failed:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "NFT purchase failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || nft.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const isValidNetwork = currentNetwork === "amoy";

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
            isValidNetwork={isValidNetwork}
          />
        </TabsContent>
        
        <TabsContent value="my-nfts" className="mt-6">
          {!isWalletConnected ? (
            <WalletConnectPrompt
              connectWallet={connectWallet}
              message="Connect your wallet to view your NFTs"
            />
          ) : !isValidNetwork ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please switch to Polygon Amoy testnet</p>
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
            <WalletConnectPrompt
              connectWallet={connectWallet}
              message="Connect your wallet to create NFTs"
            />
          ) : !isValidNetwork ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Please switch to Polygon Amoy testnet</p>
            </div>
          ) : (
            <NFTCreateForm />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTMarketplaceTab;
