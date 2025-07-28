
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomeTab from "@/components/review/portal/HomeTab";
import WriteReviewTab from "@/components/review/portal/WriteReviewTab";
import CategoriesTab from "@/components/review/portal/CategoriesTab";
import BusinessesTab from "@/components/review/portal/BusinessesTab";
import UserDashboard from "@/components/review/portal/UserDashboard";
import AnalyticsTab from "@/components/review/portal/AnalyticsTab";
import StakeTab from "@/components/review/portal/StakeTab";
import NFTMarketplaceTab from "@/components/review/portal/NFTMarketplaceTab";
import { sampleCategories } from '@/data/companyData';
import { useCompanyData } from '@/hooks/useCompanyData';

interface PortalTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isWalletConnected: boolean;
  connectWallet: () => void;
}

const PortalTabs = ({ activeTab, setActiveTab, isWalletConnected, connectWallet }: PortalTabsProps) => {
  const [searchParams] = useSearchParams();
  const { companies, recentReviews, loading } = useCompanyData();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams, setActiveTab]);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleWriteReviewClick = () => {
    setActiveTab("write-review");
  };

  const handleExploreClick = () => {
    setActiveTab("businesses");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="write-review">Write Review</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="businesses">Companies</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="staking">Staking</TabsTrigger>
        <TabsTrigger value="nft-marketplace">NFT</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <HomeTab
          categories={sampleCategories}
          topCompanies={companies}
          recentReviews={recentReviews}
          onWriteReviewClick={handleWriteReviewClick}
          onExploreClick={handleExploreClick}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="write-review">
        <WriteReviewTab 
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
          categories={sampleCategories}
        />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesTab categories={sampleCategories} />
      </TabsContent>

      <TabsContent value="businesses">
        <BusinessesTab />
      </TabsContent>

      <TabsContent value="dashboard">
        <UserDashboard />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="staking">
        <StakeTab 
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
    </Tabs>
  );
};

export default PortalTabs;
