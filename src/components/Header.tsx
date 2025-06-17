
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, CheckCircle, Home } from "lucide-react";
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import NetworkSelector from '@/components/review/NetworkSelector';
import WalletConnect from '@/components/review/WalletConnect';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();
  const { 
    isWalletConnected, 
    walletAddress, 
    currentNetwork,
    connectWallet, 
    connectWithWalletConnect,
    disconnectWallet,
    handleNetworkChange,
    isMetaMaskAvailable,
    isWalletConnecting
  } = useWalletConnection();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const handleHome = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleReviewPortal = () => {
    navigate('/review-portal');
    setIsMobileMenuOpen(false);
  };

  const handleTestnet = () => {
    window.open('https://faucets.chain.link/polygon-amoy', '_blank');
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 flex items-center justify-center">
              <CheckCircle size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent hidden sm:block">TrustTrail</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleHome} className="flex items-center gap-2">
              <Home size={16} />
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('features')}>
              Features
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('how-it-works')}>
              How it Works
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('faq')}>
              FAQ
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReviewPortal}>
              Review Portal
            </Button>
            <Button variant="ghost" size="sm" onClick={handleTestnet}>
              Testnet Tokens
            </Button>
            
            {/* Network Selector */}
            <NetworkSelector 
              currentNetwork={currentNetwork}
              onChange={handleNetworkChange}
            />
            
            {/* Wallet Connect */}
            <WalletConnect
              isConnected={isWalletConnected}
              address={walletAddress}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              onWalletConnectClick={connectWithWalletConnect}
              isMetaMaskAvailable={isMetaMaskAvailable}
              isWalletConnecting={isWalletConnecting}
            />
            
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden lg:block">
                  Welcome, {user?.email?.split('@')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-4 py-4">
            <div className="flex flex-col space-y-3">
              <Button variant="ghost" className="justify-start flex items-center gap-2" onClick={handleHome}>
                <Home size={16} />
                Home
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection('features')}>
                Features
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection('how-it-works')}>
                How it Works
              </Button>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection('faq')}>
                FAQ
              </Button>
              <Button variant="ghost" className="justify-start" onClick={handleReviewPortal}>
                Review Portal
              </Button>
              <Button variant="ghost" className="justify-start" onClick={handleTestnet}>
                Testnet Tokens
              </Button>
              
              {/* Mobile Network Selector */}
              <div className="px-3">
                <NetworkSelector 
                  currentNetwork={currentNetwork}
                  onChange={handleNetworkChange}
                />
              </div>
              
              {/* Mobile Wallet Connect */}
              <div className="px-3">
                <WalletConnect
                  isConnected={isWalletConnected}
                  address={walletAddress}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                  onWalletConnectClick={connectWithWalletConnect}
                  isMetaMaskAvailable={isMetaMaskAvailable}
                  isWalletConnecting={isWalletConnecting}
                />
              </div>
              
              {isAuthenticated && (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Welcome, {user?.email?.split('@')[0]}
                  </div>
                  <Button variant="outline" className="justify-start" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
