
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, DollarSign, ChevronRight, Zap, LineChart, TrendingUp, BarChart3, Activity } from "lucide-react";

const DexDetails = () => {
  return (
    <section id="dex-details" className="section-padding relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-trustblue-500/15 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-trustpurple-500/15 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-gradient-radial from-trustpurple-800/5 via-transparent to-transparent -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16 relative">
          {/* Added animated glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Market Data</span>
          </h2>
          <p className="text-foreground/70 text-xl max-w-2xl mx-auto">
            Real-time token analytics and market insights
          </p>
        </div>
        
        <div className="glass-card p-8 relative overflow-hidden mb-12 max-w-5xl mx-auto transform transition-all duration-500 hover:shadow-2xl group">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustpurple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -z-10 group-hover:w-80 group-hover:h-80 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-3 shadow-lg shadow-trustblue-500/20">
                <Activity size={24} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Live Market Data</h3>
            </div>
            <a 
              href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-trustblue-400 hover:text-trustblue-300 transition-colors bg-trustblue-400/10 px-4 py-2 rounded-lg hover:bg-trustblue-400/20 transform hover:scale-105 transition-all"
            >
              <span>View on DEXScreener</span>
              <ExternalLink size={16} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustblue-500/10 via-transparent to-transparent rounded-full blur-2xl -z-10"></div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={18} className="text-gold-500" />
                <p className="text-foreground/70 text-sm">Current Price</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-2xl">$0.0432</p>
                <span className="text-green-500 text-sm flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +2.4%
                </span>
              </div>
            </div>
            
            <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustpurple-500/10 via-transparent to-transparent rounded-full blur-2xl -z-10"></div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={18} className="text-trustpurple-500" />
                <p className="text-foreground/70 text-sm">24h Volume</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-2xl">$526,340</p>
                <span className="text-green-500 text-sm flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +8.7%
                </span>
              </div>
            </div>
            
            <div className="glass-card p-6 relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-gold-500/10 via-transparent to-transparent rounded-full blur-2xl -z-10"></div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-gold-500" />
                <p className="text-foreground/70 text-sm">Liquidity</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-2xl">$1.8M</p>
                <span className="text-green-500 text-sm flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +1.2%
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 mb-8 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustpurple-500/5 via-transparent to-transparent rounded-full blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="text-foreground/60 text-sm mb-2">Contract Address</p>
            <div className="flex items-center">
              <p className="font-bold text-lg truncate flex-1">0x37626759cb65752a64fd3ab945de73b28a0f880d</p>
              <button 
                className="ml-2 p-2 text-trustblue-400 hover:text-trustblue-300 bg-trustblue-400/10 hover:bg-trustblue-400/20 rounded-md transition-all" 
                onClick={() => {
                  navigator.clipboard.writeText('0x37626759cb65752a64fd3ab945de73b28a0f880d');
                  // Would add toast notification here in a full implementation
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Get detailed real-time analytics, including price charts, trading volume, and liquidity information
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-trustblue-500 to-trustblue-700 hover:from-trustblue-600 hover:to-trustblue-800 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-trustblue-500/30 transform hover:translate-y-[-2px]"
              >
                <LineChart size={18} className="mr-2" />
                View Token Analytics
              </a>
              <a 
                href="https://t.co/slAk2z0KL8" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 transform hover:translate-y-[-2px]"
              >
                <DollarSign size={18} className="mr-2" />
                Buy $NOCAP
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-trustpurple-400 hover:text-trustpurple-300 transition-colors font-medium hover:underline"
          >
            See more market details
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DexDetails;
