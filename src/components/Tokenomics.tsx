
import React from 'react';
import { 
  BarChart as ChartIcon, 
  Shield,
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
      {/* Enhanced animated background */}
      <div className="absolute inset-0 animated-bg animate-rotate-glow opacity-30 -z-10"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-trustpurple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-trustblue-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <div className="absolute inset-0 bg-gradient-radial from-trustpurple-500/20 via-transparent to-transparent rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">$NOCAP</span> Tokenomics
          </h2>
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            The native utility token powering the TrustTrail ecosystem with transparent allocation and community-first approach
          </p>
        </div>
        
        <div className="glass-card p-8 md:p-12 max-w-6xl mx-auto transform transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustpurple-500/5 via-trustblue-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
            <div className="rounded-full bg-trustpurple-500/20 p-3">
              <ChartIcon size={24} className="text-trustpurple-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-center md:text-left">Token Allocation</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={160}
                      innerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {tokenAllocation.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          className="hover:opacity-80 transition-opacity"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Allocation']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 30, 0.9)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        padding: '12px'
                      }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-4">
              <h4 className="text-xl font-semibold mb-6 text-center lg:text-left">Allocation Breakdown</h4>
              <div className="grid grid-cols-1 gap-4">
                {tokenAllocation.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-white/5 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        style={{ backgroundColor: item.color }} 
                        className="w-5 h-5 rounded-full shadow-lg"
                      ></div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10 border border-trustpurple-500/20">
                <p className="text-sm text-muted-foreground text-center lg:text-left">
                  <strong className="text-foreground">Total Supply:</strong> 1,000,000,000 $NOCAP tokens with deflationary mechanisms and community governance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
