
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
  
  // Add particle effect
  useEffect(() => {
    const createParticle = () => {
      const particlesContainer = document.querySelector('#particles-container');
      if (!particlesContainer) return;
      
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Random size
      const size = Math.random() * 4 + 1;
      
      // Random opacity
      const opacity = Math.random() * 0.5 + 0.2;
      
      // Random color
      const colors = ['#7b58f6', '#2c9fff', '#f0b003', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random duration
      const duration = Math.random() * 15 + 10;
      
      // Apply styles
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
        animation: float ${duration}s ease-in-out infinite;
      `;
      
      particlesContainer.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };
    
    // Create particles initially
    for (let i = 0; i < 30; i++) {
      createParticle();
    }
    
    // Continue creating particles
    const intervalId = setInterval(() => {
      createParticle();
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className={`min-h-screen bg-background text-foreground ${theme}`}>
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
