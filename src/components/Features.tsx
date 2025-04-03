
import React from 'react';
import { Shield, Star, CheckCircle, FileText, Users, Cloud } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-trustpurple-500" />,
      title: "Blockchain Verification",
      description: "Every review is securely stored and verified on the blockchain, eliminating fake or manipulated reviews."
    },
    {
      icon: <Star className="h-10 w-10 text-gold-500" />,
      title: "Token Rewards",
      description: "Earn $NOCAP tokens for every verified review you submit, creating a fair incentive system for honest feedback."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-trustblue-500" />,
      title: "NFT Rewards",
      description: "Unlock exclusive NFTs based on your review quality and consistency, creating additional value for contributors."
    },
    {
      icon: <FileText className="h-10 w-10 text-trustpurple-400" />,
      title: "Transparent History",
      description: "Full history of reviews and business responses visible on the blockchain for complete transparency."
    },
    {
      icon: <Cloud className="h-10 w-10 text-trustblue-400" />,
      title: "AI Insights",
      description: "Businesses receive advanced AI-powered analytics from review data to improve products and services."
    },
    {
      icon: <Users className="h-10 w-10 text-gold-400" />,
      title: "Community Governance",
      description: "Token holders can participate in platform decisions and future development through DAO voting."
    }
  ];

  return (
    <section id="features" className="section-padding relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-trustpurple-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-trustblue-500/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="bg-gradient-to-r from-trustpurple-400 to-trustblue-400 bg-clip-text text-transparent">TrustTrail</span></h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Our platform combines blockchain technology with intuitive design to create a review ecosystem that benefits everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 transition-all duration-300 hover:translate-y-[-5px]"
            >
              <div className="mb-4 rounded-2xl bg-white/5 w-16 h-16 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
