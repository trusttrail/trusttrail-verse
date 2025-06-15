
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReviewPortal from "./pages/ReviewPortal";
import TestnetFaucet from "./pages/TestnetFaucet";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import RecentActivityOverlay from "@/components/RecentActivityOverlay";
import { RecentActivityProvider, useRecentActivity } from "@/hooks/useRecentActivity";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

// DEMO: use demo activity events unless in production/live setup
const DemoActivityInjector: React.FC = () => {
  const { pushNotification } = useRecentActivity();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    // Only show demo notifications when user is not authenticated
    if (isAuthenticated) return;
    
    // Demo: Fire a new review every 45s and reward every 60s (increased intervals to prevent spam)
    const demoWallets = [
      "0xA12b...F38C", "0x93ad...FbD1", "0xE54b...4a0d"
    ];
    const demoNames = [
      "Uniswap", "OpenSea", "QuickSwap", "Axie Infinity", "PancakeSwap", "SushiSwap"
    ];
    let reviewInt: NodeJS.Timeout, rewardInt: NodeJS.Timeout;

    // Start with a delay to prevent immediate spam
    setTimeout(() => {
      reviewInt = setInterval(() => {
        const name = demoNames[Math.floor(Math.random() * demoNames.length)];
        const rating = 3 + Math.floor(Math.random() * 3);
        const wallet = demoWallets[Math.floor(Math.random() * demoWallets.length)];
        pushNotification({
          type: "review",
          message: `⭐ ${rating}/5 review for ${name}`,
          wallet
        });
      }, 45000); // 45 seconds

      rewardInt = setInterval(() => {
        const amount = (Math.random() * 5 + 1).toFixed(2);
        const wallet = demoWallets[Math.floor(Math.random() * demoWallets.length)];
        pushNotification({
          type: "reward",
          message: `You earned ${amount} $TRAIL tokens 💰`,
          wallet
        });
      }, 60000); // 60 seconds
    }, 10000); // Start after 10 seconds

    return () => {
      if (reviewInt) clearInterval(reviewInt);
      if (rewardInt) clearInterval(rewardInt);
    };
  }, [pushNotification, isAuthenticated]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <RecentActivityProvider>
          <div className="transition-colors duration-300">
            <RecentActivityOverlay />
            <DemoActivityInjector />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/review-portal" element={<ReviewPortal />} />
                <Route path="/testnet-faucet" element={<TestnetFaucet />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/auth" element={<Auth />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </RecentActivityProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
