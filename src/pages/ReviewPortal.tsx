
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import PortalTabs from "./portal/PortalTabs";
import SignUpPrompt from '@/components/review/SignUpPrompt';

const ReviewPortal = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("home");
  const { isWalletConnected, connectWallet, needsSignup, existingUser } = useWalletConnection();
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16">
        {/* Show SignUp prompt for non-authenticated users with connected wallets that need action */}
        {!isAuthenticated && isWalletConnected && (needsSignup || existingUser) && (
          <SignUpPrompt 
            isWalletConnected={isWalletConnected}
            connectWallet={connectWallet}
            needsSignup={needsSignup}
            existingUser={existingUser}
          />
        )}
        
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
