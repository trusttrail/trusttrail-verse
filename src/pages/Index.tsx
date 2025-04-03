
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import DexDetails from '@/components/DexDetails';
import Tokenomics from '@/components/Tokenomics';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { theme } = useTheme();
  
  // Add enhanced particle effect
  useEffect(() => {
    const createParticle = () => {
      const particlesContainer = document.querySelector('#particles-container');
      if (!particlesContainer) return;
      
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Random size with more variation
      const size = Math.random() * 6 + 1;
      
      // Random opacity with more variation
      const opacity = Math.random() * 0.6 + 0.1;
      
      // Enhanced color palette
      const colors = theme === 'dark' 
        ? ['#7b58f6', '#2c9fff', '#f0b003', '#ffffff', '#54baff'] 
        : ['#7b58f6', '#2c9fff', '#f0b003', '#9d88fb', '#54baff'];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random duration with more variation
      const duration = Math.random() * 20 + 10;
      
      // Random blur effect
      const blur = Math.random() > 0.7 ? `blur(${Math.random() * 3}px)` : '';
      
      // Apply enhanced styles
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        opacity: ${opacity};
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: ${blur};
        animation: float ${duration}s ease-in-out infinite;
      `;
      
      particlesContainer.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };
    
    // Create particles initially
    for (let i = 0; i < 40; i++) {
      createParticle();
    }
    
    // Continue creating particles
    const intervalId = setInterval(() => {
      createParticle();
    }, 1500);
    
    return () => clearInterval(intervalId);
  }, [theme]);
  
  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${theme}`}>
      <div id="particles-container" className="fixed inset-0 overflow-hidden pointer-events-none z-0"></div>
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
