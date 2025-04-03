
import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart, ExternalLink, DollarSign } from "lucide-react";

const DexDetails = () => {
  return (
    <section id="dex-details" className="section-padding relative overflow-hidden">
      <div className="absolute top-10 right-10 w-64 h-64 bg-trustblue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-trustpurple-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            $NOCAP <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Market Data</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Real-time token analytics and market insights
          </p>
        </div>
        
        <div className="glass-card p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-trustpurple-500/20 p-2">
                <BarChart size={24} className="text-trustpurple-500" />
              </div>
              <h3 className="text-2xl font-bold">DEX Analytics</h3>
            </div>
            <a 
              href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-trustblue-400 hover:text-trustblue-300 transition-colors"
            >
              <span>View on DEXScreener</span>
              <ExternalLink size={16} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-4">
              <p className="text-foreground/60 text-sm mb-1">Network</p>
              <p className="font-bold text-lg">Polygon</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-foreground/60 text-sm mb-1">Contract</p>
              <p className="font-bold text-lg truncate">0x37626759cb65752a64fd3ab945de73b28a0f880d</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-foreground/60 text-sm mb-1">Pair Address</p>
              <p className="font-bold text-lg truncate">0x37626759cb65752a64f...</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-foreground/70 mb-6">
              View detailed analytics, including price charts, trading volume, and liquidity information on DEXScreener
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-trustblue-500 to-trustblue-700 hover:from-trustblue-600 hover:to-trustblue-800 text-white font-medium"
              >
                View Token Analytics
                <ExternalLink size={16} className="ml-2" />
              </a>
              <a 
                href="https://t.co/slAk2z0KL8" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-gold-500 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-medium"
              >
                <DollarSign size={16} className="mr-1" />
                Buy $NOCAP
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DexDetails;
