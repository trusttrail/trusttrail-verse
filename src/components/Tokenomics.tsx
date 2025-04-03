
import React from 'react';
import { 
  BarChart as ChartIcon, 
  DollarSign,
  Shield,
  Users
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
  
  const tokenUtility = [
    { name: 'Review Rewards', value: 40 },
    { name: 'Governance Voting', value: 25 },
    { name: 'Special Features', value: 20 },
    { name: 'Premium Analytics', value: 15 },
  ];

  return (
    <section id="tokenomics" className="section-padding relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-trustblue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-trustpurple-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">$NOCAP</span> Tokenomics
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            The native utility token powering the TrustTrail ecosystem
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div className="glass-card p-8">
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
          
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-trustblue-500/20 p-2">
                <DollarSign size={20} className="text-trustblue-500" />
              </div>
              <h3 className="text-2xl font-bold">Token Utility</h3>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tokenUtility}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7b58f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-6">
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
          
          <div className="glass-card p-6">
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
          
          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 flex items-center justify-center mb-4">
              <DollarSign size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Token Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-foreground/70">Token Name:</span>
                <span className="font-bold">NOCAP</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-foreground/70">Total Supply:</span>
                <span className="font-bold">100,000,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-foreground/70">Initial Supply:</span>
                <span className="font-bold">20,000,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-foreground/70">Network:</span>
                <span className="font-bold">Ethereum / Polygon</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Token Type:</span>
                <span className="font-bold">ERC-20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
