
import React from 'react';
import { Check, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Link your crypto wallet to establish your identity on TrustTrail"
    },
    {
      number: "02",
      title: "Write Review",
      description: "Share your honest experience with products or services"
    },
    {
      number: "03",
      title: "Blockchain Verification",
      description: "Your review is timestamped and stored on the blockchain"
    },
    {
      number: "04",
      title: "Earn Rewards",
      description: "Receive $NOCAP tokens and unlock NFTs for your contributions"
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-b from-background to-trustpurple-950/40">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="bg-gradient-to-r from-trustpurple-400 to-trustblue-400 bg-clip-text text-transparent">TrustTrail</span> Works</h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            A simple, transparent process for creating trusted reviews and earning rewards
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="glass-card p-8 h-full flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500 flex items-center justify-center mb-4 text-white font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="text-trustpurple-500" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto glass-card p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Blockchain Verification Process</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-trustpurple-500/20 p-1">
                <Check size={16} className="text-trustpurple-500" />
              </div>
              <div>
                <h4 className="font-bold">Tamper-Proof Records</h4>
                <p className="text-foreground/70">Once published, reviews can't be altered or deleted by anyone, including the platform</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-trustpurple-500/20 p-1">
                <Check size={16} className="text-trustpurple-500" />
              </div>
              <div>
                <h4 className="font-bold">Identity Verification</h4>
                <p className="text-foreground/70">Wallet signatures confirm reviewer authenticity while maintaining anonymity options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-trustpurple-500/20 p-1">
                <Check size={16} className="text-trustpurple-500" />
              </div>
              <div>
                <h4 className="font-bold">Public Visibility</h4>
                <p className="text-foreground/70">All transactions, including review submissions and token rewards, are publicly verifiable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
