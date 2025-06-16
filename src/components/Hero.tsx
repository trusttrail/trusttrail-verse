
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center bg-trustpurple-50 dark:bg-trustpurple-900/20 text-trustpurple-700 dark:text-trustpurple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-trustpurple-200 dark:border-trustpurple-800">
              <Shield size={16} className="mr-2" />
              Blockchain-Verified Reviews
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-trustpurple-600 via-trustblue-500 to-trustpurple-700 bg-clip-text text-transparent">
                Trust-First
              </span>
              <br />
              <span className="text-foreground">
                Web3 Reviews
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of decentralized reviews on Polygon. Earn $NOCAP tokens, 
              build reputation with Gitcoin Passport, and help create a trustworthy Web3 ecosystem 
              through verified, blockchain-secured feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-trustpurple-600 to-trustblue-600 hover:from-trustpurple-700 hover:to-trustblue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Reviewing
              <ArrowRight className="ml-2" size={20} />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-3 rounded-full mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Blockchain Secured</h3>
              <p className="text-muted-foreground text-center text-sm">
                Every review is permanently recorded on Polygon blockchain for transparency
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-3 rounded-full mb-4">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Earn $NOCAP Tokens</h3>
              <p className="text-muted-foreground text-center text-sm">
                Get rewarded with tokens for providing valuable reviews to the community
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="bg-gradient-to-br from-trustpurple-500 to-trustblue-500 p-3 rounded-full mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Identity Verified</h3>
              <p className="text-muted-foreground text-center text-sm">
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
