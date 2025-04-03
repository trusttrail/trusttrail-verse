
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Check, Star, AlertCircle, Users } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[url('/blockchain-bg.png')] bg-cover bg-center opacity-5 z-0"></div>
      <div className="absolute top-20 left-0 right-0 h-64 bg-gradient-to-b from-trustpurple-900/20 to-transparent blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 items-center">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Genuine Reviews, <br/>
              <span className="bg-gradient-to-r from-trustpurple-400 to-trustblue-400 bg-clip-text text-transparent">
                Verified on Blockchain
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto lg:mx-0">
              TrustTrail rewards authentic reviews with $NOCAP tokens and NFTs, 
              ensuring trust and transparency through blockchain verification 
              with comprehensive identity scoring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600 text-white font-medium text-lg px-8">
                Launch Review Portal
              </Button>
              <Button size="lg" variant="outline" className="border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10 font-medium text-lg">
                View Whitepaper
              </Button>
            </div>

            <div className="text-sm text-foreground/70 italic">
              <p className="mb-1">* The Launch Portal is under development and will be out soon.</p>
              <p>* The Whitepaper will be published soon as we are carefully reviewing the market conditions to ensure a fair launch and distribution for our community.</p>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-foreground/70">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-trustpurple-400" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-trustblue-400" />
                <span>Genuine Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-gold-400" />
                <span>Token Rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-red-400" />
                <span>Identity Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-green-400" />
                <span>Trusted Community</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-trustpurple-900/30 via-trustblue-900/20 to-transparent rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-20 bg-gradient-to-b from-transparent to-background absolute bottom-0 left-0 right-0"></div>
    </div>
  );
};

export default Hero;
