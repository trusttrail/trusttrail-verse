
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeTab from "@/components/review/portal/HomeTab";
import WriteReviewTab from "@/components/review/portal/WriteReviewTab";
import CategoriesTab from "@/components/review/portal/CategoriesTab";
import BusinessesTab from "@/components/review/portal/BusinessesTab";
import PassportTab from "@/components/review/portal/PassportTab";
import UserDashboard from "@/components/review/portal/UserDashboard";
import AnalyticsTab from "@/components/review/portal/AnalyticsTab";
import StakingTab from "@/components/review/portal/StakingTab";
import LiquidityTab from "@/components/review/portal/LiquidityTab";
import NFTMarketplaceTab from "@/components/review/portal/NFTMarketplaceTab";
import DeploymentTab from "@/components/review/portal/DeploymentTab";
import { sampleCategories, sampleCompanies } from '@/data/companyData';

interface PortalTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const PortalTabs = ({ activeTab, setActiveTab, isWalletConnected, connectWallet }: PortalTabsProps) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams, setActiveTab]);

  const handleWriteReviewClick = () => {
    setActiveTab("write-review");
  };

  const handleExploreClick = () => {
    setActiveTab("businesses");
  };

  const recentReviews = [
    {
      id: 1,
      companyName: "Uniswap",
      reviewerAddress: "0x1234...5678",
      rating: 5,
      title: "Excellent DeFi platform",
      content: "Uniswap has revolutionized decentralized trading with its innovative AMM model.",
      date: "2024-01-15",
      verified: true,
      upvotes: 42,
      downvotes: 3,
      gitcoinScore: 92.5,
      trustScore: 9.1,
      hasUserVoted: false,
      userVoteType: null
    },
    {
      id: 2,
      companyName: "Aave",
      reviewerAddress: "0x9876...4321",
      rating: 4,
      title: "Solid lending protocol",
      content: "Aave provides reliable lending and borrowing services with competitive rates.",
      date: "2024-01-10",
      verified: true,
      upvotes: 28,
      downvotes: 2,
      gitcoinScore: 88.3,
      trustScore: 8.7,
      hasUserVoted: false,
      userVoteType: null
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 mb-8">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="write-review">Write Review</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="businesses">Companies</TabsTrigger>
        <TabsTrigger value="passport">Passport</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="staking">Staking</TabsTrigger>
        <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
        <TabsTrigger value="nft-marketplace">NFT</TabsTrigger>
        <TabsTrigger value="deployment">Deploy</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <HomeTab
          categories={sampleCategories}
          topCompanies={sampleCompanies.slice(0, 8)}
          recentReviews={recentReviews}
          onWriteReviewClick={handleWriteReviewClick}
          onExploreClick={handleExploreClick}
        />
      </TabsContent>

      <TabsContent value="write-review">
        <WriteReviewTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesTab />
      </TabsContent>

      <TabsContent value="businesses">
        <BusinessesTab />
      </TabsContent>

      <TabsContent value="passport">
        <PassportTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>

      <TabsContent value="dashboard">
        <UserDashboard 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="staking">
        <StakingTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>

      <TabsContent value="liquidity">
        <LiquidityTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>

      <TabsContent value="nft-marketplace">
        <NFTMarketplaceTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>

      <TabsContent value="deployment">
        <DeploymentTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PortalTabs;
