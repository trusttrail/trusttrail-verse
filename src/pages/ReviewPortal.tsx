
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useTheme } from '@/hooks/useTheme';
import PortalTabs from "./portal/PortalTabs"; // <-- refactored!

const ReviewPortal = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("home");
  const { isWalletConnected, connectWallet } = useWalletConnection();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <PortalTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
        />
      </div>
      <Footer />
    </div>
  );
};
export default ReviewPortal;
