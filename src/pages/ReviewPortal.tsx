
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Grid3X3, Building, Award } from "lucide-react";

// Component imports
import NetworkSelector from "@/components/review/NetworkSelector";
import WalletConnect from "@/components/review/WalletConnect";
import WriteReviewForm from "@/components/review/WriteReviewForm";
import CategoriesView from "@/components/review/CategoriesView";
import BusinessesView from "@/components/review/BusinessesView";
import StakeRewardsView from "@/components/review/StakeRewardsView";
import PortalContent from "@/components/review/PortalContent";

// Custom hooks
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useTheme } from '@/hooks/useTheme';

// Global type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const ReviewPortal = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("portal");
  
  // Use the custom wallet hook
  const {
    isWalletConnected,
    walletAddress,
    currentNetwork,
    connectWallet,
    disconnectWallet,
    handleNetworkChange,
    isMetaMaskAvailable,
    connectWithWalletConnect,
    isWalletConnecting
  } = useWalletConnection();

  // Mock data for demonstration
  const categories = [
    { id: "defi", name: "DeFi", icon: "💰", count: 156 },
    { id: "nft", name: "NFT Marketplaces", icon: "🖼️", count: 89 },
    { id: "gaming", name: "Gaming", icon: "🎮", count: 124 },
    { id: "dao", name: "DAOs", icon: "🏛️", count: 67 },
    { id: "infrastructure", name: "Infrastructure", icon: "🏗️", count: 45 },
    { id: "social", name: "Social", icon: "👥", count: 38 }
  ];

  const topCompanies = [
    { id: 1, name: "QuickSwap", logo: "/placeholder.svg", rating: 4.8, reviewCount: 156, category: "DeFi" },
    { id: 2, name: "OpenSea", logo: "/placeholder.svg", rating: 4.6, reviewCount: 213, category: "NFT" },
    { id: 3, name: "Axie Infinity", logo: "/placeholder.svg", rating: 4.5, reviewCount: 189, category: "Gaming" },
    { id: 4, name: "Uniswap", logo: "/placeholder.svg", rating: 4.7, reviewCount: 201, category: "DeFi" }
  ];

  const recentReviews = [
    { 
      id: 1, 
      companyName: "QuickSwap", 
      reviewerAddress: "0x1234...5678", 
      rating: 5, 
      title: "Best DEX on Polygon",
      content: "QuickSwap offers the best trading experience I've had on Polygon. Low fees and high liquidity.",
      date: "2025-05-15",
      verified: true
    },
    { 
      id: 2, 
      companyName: "Axie Infinity", 
      reviewerAddress: "0x8765...4321", 
      rating: 4, 
      title: "Fun gaming experience",
      content: "Axie Infinity has been a great gaming experience. The team is responsive and the community is active.",
      date: "2025-05-14",
      verified: true
    },
    { 
      id: 3, 
      companyName: "OpenSea", 
      reviewerAddress: "0xabcd...ef12", 
      rating: 3, 
      title: "Good but needs improvements",
      content: "OpenSea has a good selection of NFTs, but the user interface could use some improvements.",
      date: "2025-05-13",
      verified: true
    }
  ];

  // Handler functions
  const handleWriteReviewClick = () => {
    setActiveTab("write-review");
  };

  const handleExploreClick = () => {
    setActiveTab("categories");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16">
        {/* Main Tabs */}
        <Tabs defaultValue="portal" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">
              TrustTrail Review Portal
            </h1>
            <div className="flex items-center gap-4">
              <TabsList className="hidden md:flex">
                <TabsTrigger value="write-review" className="flex items-center gap-1.5">
                  <Edit size={16} />
                  <span className="hidden sm:inline">Write a Review</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-1.5">
                  <Grid3X3 size={16} />
                  <span className="hidden sm:inline">Categories</span>
                </TabsTrigger>
                <TabsTrigger value="businesses" className="flex items-center gap-1.5">
                  <Building size={16} />
                  <span className="hidden sm:inline">For Businesses</span>
                </TabsTrigger>
                <TabsTrigger value="stake" className="flex items-center gap-1.5">
                  <Award size={16} />
                  <span className="hidden sm:inline">Stake Rewards</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <NetworkSelector 
                  currentNetwork={currentNetwork} 
                  onChange={handleNetworkChange} 
                />
                
                <WalletConnect 
                  isConnected={isWalletConnected}
                  address={walletAddress}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                  onWalletConnectClick={connectWithWalletConnect}
                  isMetaMaskAvailable={isMetaMaskAvailable}
                  isWalletConnecting={isWalletConnecting}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <TabsList className="w-full mb-6 md:hidden">
            <TabsTrigger value="write-review" className="flex items-center gap-1.5">
              <Edit size={16} />
              <span>Write</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1.5">
              <Grid3X3 size={16} />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-1.5">
              <Building size={16} />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger value="stake" className="flex items-center gap-1.5">
              <Award size={16} />
              <span>Stake</span>
            </TabsTrigger>
          </TabsList>

          {/* Portal Content (Default Tab) */}
          <TabsContent value="portal">
            <PortalContent 
              categories={categories}
              topCompanies={topCompanies}
              recentReviews={recentReviews}
              onWriteReviewClick={handleWriteReviewClick}
              onExploreClick={handleExploreClick}
            />
          </TabsContent>

          {/* Write Review Tab */}
          <TabsContent value="write-review">
            <WriteReviewForm 
              isWalletConnected={isWalletConnected} 
              connectWallet={connectWallet} 
            />
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoriesView categories={categories} />
          </TabsContent>

          {/* For Businesses Tab */}
          <TabsContent value="businesses">
            <BusinessesView />
          </TabsContent>

          {/* Stake Rewards Tab */}
          <TabsContent value="stake">
            <StakeRewardsView 
              isWalletConnected={isWalletConnected} 
              connectWallet={connectWallet} 
            />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPortal;
