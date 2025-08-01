
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { Web3Provider } from "@/hooks/useWeb3";
import { RecentActivityProvider } from "@/hooks/useRecentActivity";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="transition-colors duration-300">
            <Toaster />
            <Sonner />
            <Web3Provider>
              <RecentActivityProvider>
                <BrowserRouter>
                  {children}
                </BrowserRouter>
              </RecentActivityProvider>
            </Web3Provider>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
