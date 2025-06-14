
import React from "react";
import { Lock } from "lucide-react";

const AdvancedAnalyticsSection = () => {
  // This would eventually check for merchant/business user role and show analytics if allowed.
  return (
    <div className="rounded-lg border bg-muted/20 p-8 flex flex-col items-center justify-center min-h-[280px] text-center relative">
      <Lock size={40} className="mx-auto text-trustpurple-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Advanced Merchant Analytics</h2>
      <p className="mb-3 text-muted-foreground">
        Detailed company filters, AI-powered insights, competitive benchmarking and downloadable reports are available for verified businesses.
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Coming soon:</span> Sign in as a business to unlock full analytics and search your company data!
      </p>
      {/* Later: Add company filter, charts, export/report etc here for merchants */}
    </div>
  );
};

export default AdvancedAnalyticsSection;
