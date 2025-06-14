import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Grid3X3, Building, Award, Home, Zap } from "lucide-react";

// Component imports
import WriteReviewForm from "@/components/review/WriteReviewForm";
import CategoriesView from "@/components/review/CategoriesView";
import BusinessesView from "@/components/review/BusinessesView";
import StakeRewardsView from "@/components/review/StakeRewardsView";
import PortalContent from "@/components/review/PortalContent";
import DeploymentTester from "@/components/blockchain/DeploymentTester";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

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
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Use the custom wallet hook
  const {
    isWalletConnected,
    connectWallet
  } = useWalletConnection();

  // Mock data for demonstration
  const categories = [
    { id: "defi", name: "DeFi", icon: "💰", count: 156 },
    { id: "nft", name: "NFT Marketplaces", icon: "🖼️", count: 89 },
    { id: "gaming", name: "Gaming", icon: "🎮", count: 124 },
    { id: "dao", name: "DAOs", icon: "🏛️", count: 67 },
    { id: "infrastructure", name: "Infrastructure", icon: "🏗️", count: 45 },
    { id: "social", name: "Social", icon: "👥", count: 38 },
    { id: "education", name: "Education", icon: "🎓", count: 25 },
    { id: "security", name: "Security", icon: "🛡️", count: 31 },
    { id: "exchange", name: "Exchanges", icon: "💱", count: 110 },
    { id: "staking", name: "Staking", icon: "🔒", count: 41 }
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
        <Tabs defaultValue="home" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">
              TrustTrail Review Portal
            </h1>
            <div className="flex items-center gap-4">
              <TabsList className="hidden md:flex">
                <TabsTrigger value="home" className="flex items-center gap-1.5">
                  <Home size={16} />
                  <span className="hidden sm:inline">Home</span>
                </TabsTrigger>
                <TabsTrigger value="write-review" className="flex items-center gap-1.5">
                  <Edit size={16} />
                  <span className="hidden sm:inline">Write a Review</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-1.5">
                  <Grid3X3 size={16} />
                  <span className="hidden sm:inline">Explore Categories</span>
                </TabsTrigger>
                <TabsTrigger value="businesses" className="flex items-center gap-1.5">
                  <Building size={16} />
                  <span className="hidden sm:inline">For Businesses</span>
                </TabsTrigger>
                <TabsTrigger value="stake" className="flex items-center gap-1.5">
                  <Award size={16} />
                  <span className="hidden sm:inline">Stake Rewards</span>
                </TabsTrigger>
                <TabsTrigger value="deployment" className="flex items-center gap-1.5">
                  <Zap size={16} />
                  <span className="hidden sm:inline">Deploy & Test</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1.5">
                  📊
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <TabsList className="w-full mb-6 grid grid-cols-7 md:hidden">
            <TabsTrigger value="home" className="flex items-center gap-1.5">
              <Home size={16} />
              <span>Home</span>
            </TabsTrigger>
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
            <TabsTrigger value="deployment" className="flex items-center gap-1.5">
              <Zap size={16} />
              <span>Deploy</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              📊
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Content */}
          <TabsContent value="home">
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
              categories={categories}
              // TODO: accept/merge extended companies list here
              // For now still works with small mock, will be enhanced in next iteration with a proper file upload/import.
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

          {/* Deployment & Testing Tab */}
          <TabsContent value="deployment">
            {/* Quick summary for user */}
            <div className="mb-4 text-foreground/70 text-sm border border-border rounded bg-muted/40 p-3">
              <strong>What is Deploy & Test?</strong> <br />
              Use this area to deploy mock smart contracts and test blockchain features. Perfect for verifying functionality on Polygon Amoy testnet before going live!
            </div>
            <DeploymentTester />
          </TabsContent>

          {/* Analytics Dashboard Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPortal;
