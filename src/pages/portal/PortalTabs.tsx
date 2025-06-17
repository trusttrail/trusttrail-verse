
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import HomeTab from "@/components/review/portal/HomeTab";
import WriteReviewTab from "@/components/review/portal/WriteReviewTab";
import UserDashboard from "@/components/review/portal/UserDashboard";
import CategoriesTab from "@/components/review/portal/CategoriesTab";
import BusinessesTab from "@/components/review/portal/BusinessesTab";
import NFTMarketplaceTab from "@/components/review/portal/NFTMarketplaceTab";
import LiquidityTab from "@/components/review/portal/LiquidityTab";
import StakingTab from "@/components/review/portal/StakingTab";
import AnalyticsTab from "@/components/review/portal/AnalyticsTab";
import PassportTab from "@/components/review/portal/PassportTab";
import { portalTabs, categories, topCompanies, recentReviews } from "./portalTabsData";

interface PortalTabsProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  isWalletConnected: boolean;
  connectWallet: () => void;
}

export const PortalTabs = ({ activeTab, setActiveTab, isWalletConnected, connectWallet }: PortalTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <Tabs defaultValue="home" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex justify-end items-center mb-8">
            <div className="flex items-center gap-4">
              <TabsList className="hidden md:flex">
                {portalTabs.map(({ id, label, icon }) => (
                  <TabsTrigger key={id} value={id} className="flex items-center gap-1.5">
                    {typeof icon === "string"
                      ? <span>{icon}</span>
                      : React.createElement(icon, { size: 16 })}
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="mb-6">
            <ScrollArea className="w-full">
              <TabsList className="w-full grid grid-cols-5 md:hidden mb-4 min-w-max">
                {portalTabs.slice(0, 5).map(({ id, label, icon }) => (
                  <TabsTrigger key={id} value={id} className="flex flex-col items-center gap-1 p-2 min-w-16">
                    {typeof icon === "string"
                      ? <span className="text-xs">{icon}</span>
                      : React.createElement(icon, { size: 14 })}
                    <span className="text-xs">{label.split(" ")[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsList className="w-full grid grid-cols-5 md:hidden min-w-max">
                {portalTabs.slice(5).map(({ id, label, icon }) => (
                  <TabsTrigger key={id} value={id} className="flex flex-col items-center gap-1 p-2 min-w-16">
                    {typeof icon === "string"
                      ? <span className="text-xs">{icon}</span>
                      : React.createElement(icon, { size: 14 })}
                    <span className="text-xs">{label.split(" ")[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>
        )}

        {/* Tab Contents */}
        <div className="px-2 sm:px-0">
          <TabsContent value="home">
            <HomeTab 
              categories={categories}
              topCompanies={topCompanies}
              recentReviews={recentReviews}
              onWriteReviewClick={() => setActiveTab("write-review")}
              onExploreClick={() => setActiveTab("categories")}
            />
          </TabsContent>
          <TabsContent value="write-review">
            <WriteReviewTab isWalletConnected={isWalletConnected} connectWallet={connectWallet} categories={categories} />
          </TabsContent>
          <TabsContent value="my-dashboard">
            <UserDashboard />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab categories={categories} />
          </TabsContent>
          <TabsContent value="businesses">
            <BusinessesTab />
          </TabsContent>
          <TabsContent value="nft-marketplace">
            <NFTMarketplaceTab isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
          </TabsContent>
          <TabsContent value="liquidity">
            <LiquidityTab isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
          </TabsContent>
          <TabsContent value="staking">
            <StakingTab isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
          </TabsContent>
          <TabsContent value="passport">
            <PassportTab isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PortalTabs;
