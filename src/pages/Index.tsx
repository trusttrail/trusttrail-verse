
import React, { useEffect, useRef } from 'react';
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
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Enhanced particle creation
    const createParticle = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position with bias towards mouse position
      const mouseInfluence = 0.3; // How much the mouse influences particle position
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      
      const x = randomX * (1 - mouseInfluence) + mousePosition.current.x * mouseInfluence;
      const y = randomY * (1 - mouseInfluence) + mousePosition.current.y * mouseInfluence;
      
      // Enhanced particle properties
      const size = Math.random() * 6 + 1;
      const opacity = Math.random() * 0.6 + 0.1;
      
      // Enhanced color palette
      const colors = theme === 'dark' 
        ? ['#7b58f6', '#2c9fff', '#f0b003', '#ffffff', '#54baff'] 
        : ['#7b58f6', '#2c9fff', '#f0b003', '#9d88fb', '#54baff'];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // More varied durations and delays
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 2; // Add a small random delay
      
      // Random blur effect with more variation
      const blur = Math.random() > 0.5 ? `blur(${Math.random() * 3}px)` : '';
      
      // Random glow effect
      const glow = Math.random() > 0.7 ? `0 0 ${Math.random() * 8 + 2}px ${color}` : '';
      
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
        box-shadow: ${glow};
        animation: float ${duration}s ease-in-out ${delay}s infinite;
        transform: translate(-50%, -50%);
      `;
      
      particlesContainer.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        if (particle.parentNode === particlesContainer) {
          particlesContainer.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };
    
    // Create particles initially
    for (let i = 0; i < 40; i++) {
      createParticle();
    }
    
    // Continue creating particles
    const particleInterval = setInterval(() => {
      createParticle();
    }, 1000);
    
    // Handle scroll interactions
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      // Create extra particles on scroll
      if (Math.abs(scrollDelta) > 15) {
        // Add 1-3 particles when scrolling significantly
        const extraParticles = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < extraParticles; i++) {
          createParticle();
        }
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(particleInterval);
    };
  }, [theme]);
  
  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${theme}`}>
      <div 
        ref={particlesContainerRef} 
        id="particles-container" 
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      >
        <style jsx>{`
          @keyframes float {
            0% {
              transform: translate(-50%, -50%) translateY(0) translateX(0);
            }
            33% {
              transform: translate(-50%, -50%) translateY(${Math.random() * 40 - 20}px) translateX(${Math.random() * 40 - 20}px);
            }
            66% {
              transform: translate(-50%, -50%) translateY(${Math.random() * 40 - 20}px) translateX(${Math.random() * 40 - 20}px);
            }
            100% {
              transform: translate(-50%, -50%) translateY(0) translateX(0);
            }
          }
        `}</style>
      </div>
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
