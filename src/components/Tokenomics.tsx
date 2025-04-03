
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
      
      <div className="container mx-auto">
        <div className="text-center mb-16 relative">
          {/* Added glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-trustpurple-500/20 via-transparent to-transparent rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">$NOCAP</span> Tokenomics
          </h2>
          <p className="text-foreground/70 text-xl max-w-2xl mx-auto">
            The native utility token powering the TrustTrail ecosystem
          </p>
        </div>
        
        <div className="glass-card p-8 mb-12 max-w-4xl mx-auto transform transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustpurple-500/5 via-trustblue-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-trustpurple-500/20 p-2">
              <ChartIcon size={20} className="text-trustpurple-500" />
            </div>
            <h3 className="text-2xl font-bold">Token Allocation</h3>
          </div>
            
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={140}
                  innerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {tokenAllocation.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Allocation']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 15, 30, 0.8)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
            
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {tokenAllocation.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors"
              >
                <div 
                  style={{ backgroundColor: item.color }} 
                  className="w-4 h-4 rounded-full"
                ></div>
                <span className="text-sm text-foreground/80">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
