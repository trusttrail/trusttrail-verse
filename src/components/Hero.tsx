
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/review-portal');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="text-center">
          <div className="mb-12">
            <div className="inline-flex items-center bg-trustpurple-50 dark:bg-trustpurple-900/20 text-trustpurple-700 dark:text-trustpurple-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-trustpurple-200 dark:border-trustpurple-800">
              <Shield size={18} className="mr-2" />
              Blockchain-Verified Reviews
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight max-w-5xl mx-auto">
              <span className="bg-gradient-to-r from-trustpurple-600 via-trustblue-500 to-trustpurple-700 bg-clip-text text-transparent block mb-2">
                Trust-First
              </span>
              <span className="text-foreground block">
                Web3 Reviews
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed px-4">
              Experience the future of decentralized reviews on Polygon. Earn $NOCAP tokens, 
              build reputation with Gitcoin Passport, and help create a trustworthy Web3 ecosystem 
              through verified, blockchain-secured feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 px-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-trustpurple-600 to-trustblue-600 hover:from-trustpurple-700 hover:to-trustblue-700 text-white px-10 py-7 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[200px]"
            >
              Start Reviewing
              <ArrowRight className="ml-2" size={20} />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('how-it-works')}
              className="px-10 py-7 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-300 min-w-[200px]"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 min-h-[280px]">
              <div className="bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-4 rounded-full mb-6">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-center">Blockchain Secured</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Every review is permanently recorded on Polygon blockchain for transparency and immutability
              </p>
            </div>

            <div className="flex flex-col items-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 min-h-[280px]">
              <div className="bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-4 rounded-full mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-center">Earn $NOCAP Tokens</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Get rewarded with tokens for providing valuable reviews to the community
              </p>
            </div>

            <div className="flex flex-col items-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 min-h-[280px]">
              <div className="bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-4 rounded-full mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-center">Identity Verified</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                Reviews from Gitcoin Passport verified users for enhanced credibility
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
