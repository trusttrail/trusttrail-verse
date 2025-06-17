
import React, { useState } from "react";
import BasicAnalyticsSection from "./BasicAnalyticsSection";
import AdvancedAnalyticsSection from "./AdvancedAnalyticsSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Comprehensive insights and metrics for your reviews and platform activity
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={val => setActiveTab(val as "basic" | "advanced")} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
            <TabsTrigger 
              value="basic" 
              className="px-6 py-3 text-base font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              User Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="px-6 py-3 text-base font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Merchant Analytics
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="basic" className="mt-0">
          <BasicAnalyticsSection />
        </TabsContent>
        <TabsContent value="advanced" className="mt-0">
          <AdvancedAnalyticsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
