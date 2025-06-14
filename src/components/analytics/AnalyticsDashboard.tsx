
import React, { useState } from "react";
import BasicAnalyticsSection from "./BasicAnalyticsSection";
import AdvancedAnalyticsSection from "./AdvancedAnalyticsSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AnalyticsDashboard = () => {
  // In future, could check role here to auto-switch to "Advanced" if merchant signed in
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  return (
    <section className="w-full mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">
        Analytics Dashboard
      </h1>
      <Tabs value={activeTab} onValueChange={val => setActiveTab(val as "basic" | "advanced")}>
        <TabsList className="bg-muted mb-6">
          <TabsTrigger value="basic">User Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Merchant Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <BasicAnalyticsSection />
        </TabsContent>
        <TabsContent value="advanced">
          <AdvancedAnalyticsSection />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AnalyticsDashboard;
