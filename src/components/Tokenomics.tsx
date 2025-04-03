
import React from 'react';
import { 
  BarChart as ChartIcon, 
  DollarSign,
  Shield,
  Users,
  TrendingUp
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const Tokenomics = () => {
  const tokenAllocation = [
    { name: 'Community Rewards', value: 40, color: '#7b58f6' },
    { name: 'Development', value: 20, color: '#2c9fff' },
    { name: 'Team & Advisors', value: 15, color: '#54baff' },
    { name: 'Marketing', value: 10, color: '#f0b003' },
    { name: 'Ecosystem Growth', value: 10, color: '#a35e06' },
    { name: 'Reserve', value: 5, color: '#4c28ab' },
  ];

  return (
    <section id="tokenomics" className="section-padding relative overflow-hidden">
      <div className="animated-bg absolute w-full h-full opacity-50 animate-rotate-glow -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">$NOCAP</span> Tokenomics
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            The native utility token powering the TrustTrail ecosystem
          </p>
        </div>
        
        <div className="glass-card p-8 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-trustpurple-500/20 p-2">
              <ChartIcon size={20} className="text-trustpurple-500" />
            </div>
            <h3 className="text-2xl font-bold">Token Allocation</h3>
          </div>
            
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tokenAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
            
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {tokenAllocation.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div style={{ backgroundColor: item.color }} className="w-3 h-3 rounded-full"></div>
                <span className="text-sm text-foreground/80">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500 flex items-center justify-center mb-4">
              <Shield size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Staking Benefits</h3>
            <p className="text-foreground/70 mb-4">
              Stake $NOCAP tokens to earn additional rewards and unlock premium features on the platform
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-trustpurple-400"></div>
                <span>Higher review reward multipliers</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-trustpurple-400"></div>
                <span>Priority verification processing</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-trustpurple-400"></div>
                <span>Access to exclusive NFT collections</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500 flex items-center justify-center mb-4">
              <Users size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Governance</h3>
            <p className="text-foreground/70 mb-4">
              $NOCAP token holders can participate in platform governance through voting on proposals
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-trustpurple-400"></div>
                <span>Vote on feature development</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-trustpurple-400"></div>
                <span>Influence reward distribution</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-trustpurple-400"></div>
                <span>Participate in token economics decisions</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 flex items-center justify-center mb-4">
              <TrendingUp size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Market Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-border-light pb-2">
                <span className="text-foreground/70">Token Name:</span>
                <span className="font-bold">NOCAP</span>
              </div>
              <div className="flex justify-between items-center border-b border-border-light pb-2">
                <span className="text-foreground/70">Total Supply:</span>
                <span className="font-bold">100,000,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-border-light pb-2">
                <span className="text-foreground/70">Market Cap:</span>
                <span className="font-bold">$4.2M</span>
              </div>
              <div className="flex justify-between items-center border-b border-border-light pb-2">
                <span className="text-foreground/70">24h Volume:</span>
                <span className="font-bold">$526,340</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Liquidity:</span>
                <span className="font-bold">$1.8M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
