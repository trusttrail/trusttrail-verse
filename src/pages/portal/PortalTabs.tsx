import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HomeTab from "@/components/review/portal/HomeTab";
import WriteReviewTab from "@/components/review/portal/WriteReviewTab";
import CategoriesTab from "@/components/review/portal/CategoriesTab";
import BusinessesTab from "@/components/review/portal/BusinessesTab";
import NFTMarketplaceTab from "@/components/review/portal/NFTMarketplaceTab";
import LiquidityTab from "@/components/review/portal/LiquidityTab";
import StakingTab from "@/components/review/portal/StakingTab";
import DeploymentTab from "@/components/review/portal/DeploymentTab";
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
  return (
    <Tabs defaultValue="home" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-end items-center mb-8">
        <div className="flex items-center gap-4">
          <TabsList className="hidden md:flex">
            {portalTabs.map(({ id, label, icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center gap-1.5">
                {/* Render icon: component or string */}
                {typeof icon === "string"
                  ? <span>{icon}</span>
                  : React.createElement(icon, { size: 16 })}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
      {/* Mobile Tabs */}
      <TabsList className="w-full mb-6 grid grid-cols-9 md:hidden">
        {portalTabs.map(({ id, label, icon }) => (
          <TabsTrigger key={id} value={id} className="flex items-center gap-1.5">
            {typeof icon === "string"
              ? <span>{icon}</span>
              : React.createElement(icon, { size: 16 })}
            <span>{label.split(" ")[0]}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {/* Tab Contents */}
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
      <TabsContent value="deployment">
        <div className="mb-4 text-foreground/70 text-sm border border-border rounded bg-muted/40 p-3">
          <strong>What is Deploy & Test?</strong> <br />
          Use this area to deploy mock smart contracts and test blockchain features. Perfect for verifying functionality on Polygon Amoy testnet before going live!
        </div>
        <DeploymentTab />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>
    </Tabs>
  );
};

export default PortalTabs;
