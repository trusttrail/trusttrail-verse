import React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminAdvancedAnalytics = () => (
  <div className="rounded-lg border-2 border-green-500 bg-muted/15 p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
    <h2 className="text-2xl font-semibold mb-2 text-green-700">Merchant Analytics (Admin View)</h2>
    <p className="mb-3 text-muted-foreground">
      Here you will see advanced, company-focused analytics: deep dives, competitive benchmarking and downloadable reports.
    </p>
    <p className="text-sm text-muted-foreground">
      <span className="font-medium">Note:</span> This is visible only to admins now.<br />
      (All analytics features here are for preview/demo. Actual company analytics will come soon!)
    </p>
    <div className="mt-6">
      {/* Placeholder for advanced analytics charts/tables (admins only) */}
      <div className="bg-background p-4 rounded shadow border flex flex-col gap-2 max-w-lg mx-auto">
        <div className="font-bold">📊 [Merchant review trends - sample chart here]</div>
        <div className="text-sm text-muted-foreground">Add your merchant analytics charts and drill-downs here for admin review.</div>
      </div>
    </div>
  </div>
);

const RestrictedSection = () => (
  <div className="rounded-lg border bg-muted/20 p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
    <Lock size={40} className="mx-auto text-trustpurple-400 mb-4" />
    <h2 className="text-xl font-semibold mb-2">Restricted: Merchant Analytics</h2>
    <p className="mb-3 text-muted-foreground">
      Access to advanced merchant analytics is currently restricted to administrators.
    </p>
    <p className="text-sm text-muted-foreground">
      If you believe you should have access, please contact the platform team.
    </p>
  </div>
);

const AdvancedAnalyticsSection = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // For now, only users whose profile has `is_admin === true` are allowed
  // We'll check if user metadata has "is_admin" set (for safety)
  const isAdmin =
    user &&
    ((user.user_metadata && (user.user_metadata.is_admin === true || user.user_metadata.role === "admin")) ||
      // fallback: supabase profile adds "is_admin" custom claim
      (user.app_metadata && (user.app_metadata.is_admin === true || user.app_metadata.role === "admin")));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustpurple-500"></span>
      </div>
    );
  }

  // Only show merchant analytics to admins
  if (isAuthenticated && isAdmin) {
    return <AdminAdvancedAnalytics />;
  }

  // Otherwise show restricted message
  return <RestrictedSection />;
};

export default AdvancedAnalyticsSection;
