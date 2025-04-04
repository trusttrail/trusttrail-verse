
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, LineChart, BarChart3, DollarSign, ChevronRight } from "lucide-react";

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
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Market Insights</span>
          </h2>
          <p className="text-foreground/70 text-xl max-w-2xl mx-auto">
            Transparent analytics to help investors make informed decisions
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card mb-8 overflow-hidden shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-3 shadow-lg shadow-trustblue-500/20">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">TrustTrail Analytics</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2 text-lg">
                View real-time, transparent market data from trusted sources
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-foreground/80">
                TrustTrail is committed to transparency. Rather than displaying potentially outdated metrics, 
                we encourage our community to check the latest data directly from trusted third-party analytics platforms.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href="https://dexscreener.com/polygon/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="glass-card p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-trustblue-500/20 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full bg-trustblue-500/20 p-2">
                        <LineChart size={20} className="text-trustblue-500" />
                      </div>
                      <h3 className="font-bold text-xl">DEXScreener</h3>
                    </div>
                    <p className="text-foreground/70 mb-4 flex-grow">
                      Real-time trading data, liquidity information, and price charts for $NOCAP token
                    </p>
                    <div className="flex items-center text-trustblue-400 group-hover:text-trustblue-300 transition-colors gap-1 mt-auto">
                      <span>View on DEXScreener</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://www.geckoterminal.com/polygon_pos/pools/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="glass-card p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full bg-gold-500/20 p-2">
                        <DollarSign size={20} className="text-gold-500" />
                      </div>
                      <h3 className="font-bold text-xl">GeckoTerminal</h3>
                    </div>
                    <p className="text-foreground/70 mb-4 flex-grow">
                      Comprehensive market insights, trade history, and detailed pool analytics
                    </p>
                    <div className="flex items-center text-gold-500 group-hover:text-gold-400 transition-colors gap-1 mt-auto">
                      <span>View on GeckoTerminal</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="glass-card p-6 mt-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg group">
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
                    aria-label="Copy contract address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                  TrustTrail provides transparent market data to build investor confidence. We encourage users to verify information from trusted third-party sources.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
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
            </CardContent>
          </Card>
          
          <div className="text-center">
            <a 
              href="https://polygonscan.com/token/0x37626759cb65752a64fd3ab945de73b28a0f880d" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-trustpurple-400 hover:text-trustpurple-300 transition-colors font-medium hover:underline"
            >
              Verify on Polygonscan
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DexDetails;
