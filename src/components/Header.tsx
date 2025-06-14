
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletConnection } from '@/hooks/useWalletConnection';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();
  const { isWalletConnected, walletAddress, connectWallet } = useWalletConnection();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const handleReviewPortal = () => {
    navigate('/review-portal');
    setIsMobileMenuOpen(false);
  };

  const handleAuth = () => {
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-r from-trustpurple-500 to-trustblue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <span className="font-bold text-lg clip-text hidden sm:block">TrustTrail</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={handleReviewPortal}>
              Review Portal
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden lg:block">
                  Welcome, {user?.email?.split('@')[0]}
                </span>
                {isWalletConnected && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded-full hidden lg:block">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {!isWalletConnected && (
                  <Button variant="outline" size="sm" onClick={connectWallet}>
                    Connect Wallet
                  </Button>
                )}
                <Button size="sm" onClick={handleAuth}>
                  Sign In
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
              <Button variant="ghost" className="justify-start" onClick={handleReviewPortal}>
                Review Portal
              </Button>
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Welcome, {user?.email?.split('@')[0]}
                  </div>
                  {isWalletConnected && (
                    <div className="px-3 py-1">
                      <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded-full">
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                      </span>
                    </div>
                  )}
                  <Button variant="outline" className="justify-start" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  {!isWalletConnected && (
                    <Button variant="outline" className="justify-start" onClick={connectWallet}>
                      Connect Wallet
                    </Button>
                  )}
                  <Button className="justify-start" onClick={handleAuth}>
                    Sign In
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
