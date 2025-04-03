
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import DexDetails from '@/components/DexDetails';
import Tokenomics from '@/components/Tokenomics';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Tokenomics />
      <DexDetails />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
