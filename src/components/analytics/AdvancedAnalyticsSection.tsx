import React from "react";
import { Lock, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdvancedAnalyticsDashboard from "./AdvancedAnalyticsDashboard";

const AdminAdvancedAnalytics = () => (
  <div className="space-y-6">
    <Card className="border-2 border-green-500/20 bg-green-500/5 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-700 dark:text-green-400">
          Merchant Analytics Dashboard
        </CardTitle>
        <CardDescription className="text-base max-w-2xl mx-auto">
          Advanced company-focused analytics with deep insights, competitive benchmarking, and comprehensive reporting tools.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
              📊 Review Analytics
              <Badge variant="secondary" className="text-xs">Live</Badge>
            </h4>
            <p className="text-sm text-muted-foreground">
              Comprehensive review trend analysis with sentiment tracking and competitor comparison.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
              🎯 Engagement Metrics
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </h4>
            <p className="text-sm text-muted-foreground">
              User interaction patterns, response rates, and engagement quality measurements.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
              📈 Performance Reports
              <Badge variant="secondary" className="text-xs">Pro</Badge>
            </h4>
            <p className="text-sm text-muted-foreground">
              Downloadable insights with custom date ranges and automated report generation.
            </p>
          </div>
        </div>
        
        <div className="text-center p-6 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">Administrator Access:</span> You have full access to all merchant analytics features.
          </p>
          <p className="text-xs text-muted-foreground">
            All analytics features are currently in preview mode. Full implementation with real-time data coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
    
    {/* Include the advanced dashboard for admins */}
    <AdvancedAnalyticsDashboard />
  </div>
);

const RestrictedSection = () => (
  <div className="space-y-6">
    <Card className="border border-border/50 bg-card/30 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-6">
        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-trustpurple-400" />
        </div>
        
        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-semibold">Merchant Analytics</h2>
          <p className="text-muted-foreground leading-relaxed">
            Access to advanced merchant analytics and business intelligence features is currently restricted to platform administrators.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This section includes:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Company performance benchmarking</li>
              <li>• Advanced review trend analysis</li>
              <li>• Competitive intelligence reports</li>
              <li>• Custom analytics dashboards</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50 max-w-sm">
          <p className="text-xs text-muted-foreground">
            If you believe you should have access to these features, please contact the platform administrators.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const AdvancedAnalyticsSection = () => {
  const { user, loading, isAuthenticated } = useAuth();

  const isAdmin =
    user &&
    ((user.user_metadata && (user.user_metadata.is_admin === true || user.user_metadata.role === "admin")) ||
      (user.app_metadata && (user.app_metadata.is_admin === true || user.app_metadata.role === "admin")));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trustpurple-500"></div>
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <AdminAdvancedAnalytics />;
  }

  return <RestrictedSection />;
};

export default AdvancedAnalyticsSection;
