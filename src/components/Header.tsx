
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, CheckCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WalletConnect from "./review/WalletConnect";
import NetworkSelector from "./review/NetworkSelector";
import { Link, useLocation } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/useWalletConnection';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const {
    isWalletConnected,
    walletAddress,
    currentNetwork,
    connectWallet,
    disconnectWallet,
    connectWithWalletConnect,
    handleNetworkChange,
    isMetaMaskAvailable,
    isWalletConnecting
  } = useWalletConnection();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Check if we're on the review portal page
  const isReviewPortalPage = location.pathname === '/review-portal';
  
  // Function to handle navigation to home page with hash links
  const handleNavClick = (hash: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home with hash
      window.location.href = `/${hash}`;
    } else {
      // If on home page, just scroll to section
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 flex items-center justify-center mr-2">
              <CheckCircle size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">TrustTrail</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
          <button onClick={() => handleNavClick('#features')} className="text-foreground/80 hover:text-foreground transition-colors">Features</button>
          <button onClick={() => handleNavClick('#how-it-works')} className="text-foreground/80 hover:text-foreground transition-colors">How It Works</button>
          <button onClick={() => handleNavClick('#tokenomics')} className="text-foreground/80 hover:text-foreground transition-colors">Tokenomics</button>
          <button onClick={() => handleNavClick('#dex-details')} className="text-foreground/80 hover:text-foreground transition-colors">DEX Details</button>
          <button onClick={() => handleNavClick('#faq')} className="text-foreground/80 hover:text-foreground transition-colors">FAQ</button>
          <ThemeToggle />
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="https://t.co/slAk2z0KL8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 border border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10 rounded-md text-sm font-medium"
          >
            <ShoppingCart size={18} />
            Buy $NOCAP
          </a>
          <NetworkSelector 
            currentNetwork={currentNetwork} 
            onChange={handleNetworkChange} 
          />
          <WalletConnect 
            isConnected={isWalletConnected}
            address={walletAddress}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            onWalletConnectClick={connectWithWalletConnect}
            isMetaMaskAvailable={isMetaMaskAvailable}
            isWalletConnecting={isWalletConnecting}
          />
          {!isReviewPortalPage && (
            <Link to="/review-portal">
              <Button className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600 text-white">Launch App</Button>
            </Link>
          )}
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-foreground" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-foreground/80 hover:text-foreground py-2 transition-colors" onClick={toggleMenu}>Home</Link>
            <button onClick={() => handleNavClick('#features')} className="text-foreground/80 hover:text-foreground py-2 transition-colors text-left">Features</button>
            <button onClick={() => handleNavClick('#how-it-works')} className="text-foreground/80 hover:text-foreground py-2 transition-colors text-left">How It Works</button>
            <button onClick={() => handleNavClick('#tokenomics')} className="text-foreground/80 hover:text-foreground py-2 transition-colors text-left">Tokenomics</button>
            <button onClick={() => handleNavClick('#dex-details')} className="text-foreground/80 hover:text-foreground py-2 transition-colors text-left">DEX Details</button>
            <button onClick={() => handleNavClick('#faq')} className="text-foreground/80 hover:text-foreground py-2 transition-colors text-left">FAQ</button>
            <div className="flex flex-col space-y-3 pt-3">
              <a 
                href="https://t.co/slAk2z0KL8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 py-2 border border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10 rounded-md text-sm font-medium"
              >
                <ShoppingCart size={18} />
                Buy $NOCAP
              </a>
              <NetworkSelector 
                currentNetwork={currentNetwork} 
                onChange={handleNetworkChange} 
              />
              <WalletConnect 
                isConnected={isWalletConnected}
                address={walletAddress}
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
                onWalletConnectClick={connectWithWalletConnect}
                isMetaMaskAvailable={isMetaMaskAvailable}
                isWalletConnecting={isWalletConnecting}
              />
              {!isReviewPortalPage && (
                <Link to="/review-portal">
                  <Button className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600 text-white w-full">Launch App</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
