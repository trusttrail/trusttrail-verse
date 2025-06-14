import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HomeTab from "@/components/review/portal/HomeTab";
import WriteReviewTab from "@/components/review/portal/WriteReviewTab";
import CategoriesTab from "@/components/review/portal/CategoriesTab";
import BusinessesTab from "@/components/review/portal/BusinessesTab";
import StakeTab from "@/components/review/portal/StakeTab";
import DeploymentTab from "@/components/review/portal/DeploymentTab";
import AnalyticsTab from "@/components/review/portal/AnalyticsTab";
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">TrustTrail Review Portal</h1>
        <div className="flex items-center gap-4">
          <TabsList className="hidden md:flex">
            {portalTabs.map(({ id, label, icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center gap-1.5">
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
      {/* Mobile Tabs */}
      <TabsList className="w-full mb-6 grid grid-cols-7 md:hidden">
        {portalTabs.map(({ id, label, icon }) => (
          <TabsTrigger key={id} value={id} className="flex items-center gap-1.5">
            {icon}
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
      <TabsContent value="stake">
        <StakeTab isWalletConnected={isWalletConnected} connectWallet={connectWallet} />
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
