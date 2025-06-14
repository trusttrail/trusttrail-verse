
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import DexDetails from '@/components/DexDetails';
import FakeReviewDetection from '@/components/FakeReviewDetection';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import ParticleContainer from '@/components/ParticleContainer';
import { useTheme } from '@/hooks/useTheme';
import { useWalletConnection } from '@/hooks/useWalletConnection';

const Index = () => {
  const { theme } = useTheme();
  
  // Initialize wallet connection on the home page to maintain state across pages
  const walletConnection = useWalletConnection();
  
  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${theme}`}>
      <Header />
      <ParticleContainer theme={theme} />
      <Hero />
      <Features />
      <HowItWorks />
      <FakeReviewDetection />
      <DexDetails />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
