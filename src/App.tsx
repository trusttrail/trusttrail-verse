
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
import { useWalletConnection } from "@/hooks/useWalletConnection";

const queryClient = new QueryClient();

// DEMO: use demo activity events unless in production/live setup
const DemoActivityInjector: React.FC = () => {
  const { pushNotification, clearNotifications } = useRecentActivity();
  const { isAuthenticated } = useAuth();
  const { isWalletConnected } = useWalletConnection();
  const hasStartedRef = React.useRef(false);
  const intervalsRef = React.useRef<{ review?: NodeJS.Timeout; reward?: NodeJS.Timeout }>({});
  const isStoppedRef = React.useRef(false);

  React.useEffect(() => {
    // Stop demo notifications when user is authenticated OR wallet is connected
    if (isAuthenticated || isWalletConnected) {
      console.log('Stopping demo notifications - user authenticated or wallet connected');
      
      // Mark as stopped
      isStoppedRef.current = true;
      
      // Clear all intervals
      if (intervalsRef.current.review) {
        clearInterval(intervalsRef.current.review);
        intervalsRef.current.review = undefined;
      }
      if (intervalsRef.current.reward) {
        clearInterval(intervalsRef.current.reward);
        intervalsRef.current.reward = undefined;
      }
      
      // Clear existing notifications
      clearNotifications();
      
      hasStartedRef.current = false;
      return;
    }

    // Don't start if already stopped due to wallet/auth activity
    if (isStoppedRef.current) {
      return;
    }

    // Only show demo notifications when user is not authenticated AND wallet not connected
    if (hasStartedRef.current) return;
    
    // Mark as started to prevent multiple initializations
    hasStartedRef.current = true;
    
    console.log('Starting demo activity injector...');
    
    // Demo: Fire a new review every 45s and reward every 60s
    const demoWallets = [
      "0xA12b...F38C", "0x93ad...FbD1", "0xE54b...4a0d"
    ];
    const demoNames = [
      "Uniswap", "OpenSea", "QuickSwap", "Axie Infinity", "PancakeSwap", "SushiSwap"
    ];

    // Start with a delay to prevent immediate spam
    const initTimeout = setTimeout(() => {
      // Double check we haven't been stopped
      if (isStoppedRef.current) return;
      
      console.log('Starting demo intervals...');
      
      intervalsRef.current.review = setInterval(() => {
        // Check if we should stop before pushing notification
        if (isStoppedRef.current || isAuthenticated || isWalletConnected) {
          if (intervalsRef.current.review) clearInterval(intervalsRef.current.review);
          return;
        }
        
        const name = demoNames[Math.floor(Math.random() * demoNames.length)];
        const rating = 3 + Math.floor(Math.random() * 3);
        const wallet = demoWallets[Math.floor(Math.random() * demoWallets.length)];
        console.log('Pushing demo review notification...');
        pushNotification({
          type: "review",
          message: `⭐ ${rating}/5 review for ${name}`,
          wallet
        });
      }, 45000); // 45 seconds

      intervalsRef.current.reward = setInterval(() => {
        // Check if we should stop before pushing notification
        if (isStoppedRef.current || isAuthenticated || isWalletConnected) {
          if (intervalsRef.current.reward) clearInterval(intervalsRef.current.reward);
          return;
        }
        
        const amount = (Math.random() * 5 + 1).toFixed(2);
        const wallet = demoWallets[Math.floor(Math.random() * demoWallets.length)];
        console.log('Pushing demo reward notification...');
        pushNotification({
          type: "reward",
          message: `You earned ${amount} $NOCAP tokens 💰`,
          wallet
        });
      }, 60000); // 60 seconds
    }, 10000); // Start after 10 seconds

    return () => {
      console.log('Cleaning up demo activity injector...');
      clearTimeout(initTimeout);
      if (intervalsRef.current.review) {
        clearInterval(intervalsRef.current.review);
        intervalsRef.current.review = undefined;
      }
      if (intervalsRef.current.reward) {
        clearInterval(intervalsRef.current.reward);
        intervalsRef.current.reward = undefined;
      }
      hasStartedRef.current = false;
    };
  }, [pushNotification, isAuthenticated, isWalletConnected, clearNotifications]);

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
