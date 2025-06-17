
import React, { useState } from 'react';
import { Twitter, Shield, MessageSquare, ExternalLink, CheckCircle, Mail, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ContactModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-foreground/70 hover:text-foreground transition-colors">
          Contact Us
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail size={20} />
            Contact TrustTrail
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Get in touch with our team through your preferred platform:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3 h-12"
            >
              <a
                href="https://x.com/trusttrail69"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-black text-lg">X</span>
                <div className="text-left">
                  <div className="font-medium">Twitter DM</div>
                  <div className="text-sm text-muted-foreground">@trusttrail69</div>
                </div>
                <ExternalLink size={16} className="ml-auto" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3 h-12"
            >
              <a
                href="https://t.me/TrustTrail69"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send size={18} />
                <div className="text-left">
                  <div className="font-medium">Telegram Group</div>
                  <div className="text-sm text-muted-foreground">@TrustTrail69</div>
                </div>
                <ExternalLink size={16} className="ml-auto" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-trustpurple-950/30 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <a href="https://x.com/trusttrail69" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 flex items-center justify-center mr-2">
                  <CheckCircle size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-trustpurple-300 to-trustblue-400 bg-clip-text text-transparent">TrustTrail</span>
              </a>
            </div>
            <p className="text-foreground/70 mb-4">
              Blockchain-verified reviews with token rewards for genuine feedback and identity scoring
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://x.com/trusttrail69" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors hover:bg-trustpurple-500/20"
              >
                {/* Stylized "X" for X (formerly Twitter) */}
                <span className="font-black text-lg text-foreground/80">X</span>
              </a>
              <a 
                href="https://t.me/TrustTrail69" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors hover:bg-trustpurple-500/20"
              >
                <Send size={20} className="text-foreground/70" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#tokenomics" className="text-foreground/70 hover:text-foreground transition-colors">Tokenomics</a></li>
              <li><a href="#dex-details" className="text-foreground/70 hover:text-foreground transition-colors">DEX Details</a></li>
              <li><a href="#faq" className="text-foreground/70 hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Whitepaper</a></li>
              <li>
                <a 
                  href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Token Analytics
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://t.co/slAk2z0KL8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
                >
                  Buy $NOCAP
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><ContactModal /></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            © {currentYear} TrustTrail. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-foreground/60">
            <Shield size={12} className="mr-1" />
            <span>Secured with blockchain technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
