
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, CheckCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="https://x.com/trusttrail69" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 flex items-center justify-center mr-2">
              <CheckCircle size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">TrustTrail</span>
          </a>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">How It Works</a>
          <a href="#tokenomics" className="text-foreground/80 hover:text-foreground transition-colors">Tokenomics</a>
          <a href="#dex-details" className="text-foreground/80 hover:text-foreground transition-colors">DEX Details</a>
          <a href="#faq" className="text-foreground/80 hover:text-foreground transition-colors">FAQ</a>
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
          <Button variant="outline" className="border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10">Connect Wallet</Button>
          <Button className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600 text-white">Launch App</Button>
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
            <a href="#features" className="text-foreground/80 hover:text-foreground py-2 transition-colors" onClick={toggleMenu}>Features</a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-foreground py-2 transition-colors" onClick={toggleMenu}>How It Works</a>
            <a href="#tokenomics" className="text-foreground/80 hover:text-foreground py-2 transition-colors" onClick={toggleMenu}>Tokenomics</a>
            <a href="#dex-details" className="text-foreground/80 hover:text-foreground py-2 transition-colors" onClick={toggleMenu}>DEX Details</a>
            <a href="#faq" className="text-foreground/80 hover:text-foreground py-2 transition-colors" onClick={toggleMenu}>FAQ</a>
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
              <Button variant="outline" className="border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10">Connect Wallet</Button>
              <Button className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600 text-white">Launch App</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
