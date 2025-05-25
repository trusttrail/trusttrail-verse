import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import DexDetails from '@/components/DexDetails';
import FakeReviewDetection from '@/components/FakeReviewDetection';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';
import { useWalletConnection } from '@/hooks/useWalletConnection';

const Index = () => {
  const { theme } = useTheme();
  
  // Initialize wallet connection on the home page to maintain state across pages
  const walletConnection = useWalletConnection();
  
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create a galaxy star particle
    const createStar = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position with bias towards mouse position
      const mouseInfluence = 0.2; // Reduced mouse influence for more natural galaxy look
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      
      const x = randomX * (1 - mouseInfluence) + mousePosition.current.x * mouseInfluence;
      const y = randomY * (1 - mouseInfluence) + mousePosition.current.y * mouseInfluence;
      
      // Enhanced star properties
      const size = Math.random() * 3 + 0.5; // Smaller stars for galaxy feel
      const opacity = Math.random() * 0.8 + 0.2;
      
      // Color palette for stars
      const colors = theme === 'dark' 
        ? ['#ffffff', '#fffaea', '#e0f8ff', '#e0e8ff', '#f5e0ff'] 
        : ['#ffffff', '#fffaea', '#e0f8ff', '#7b58f6', '#2c9fff'];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Varied durations and delays
      const duration = Math.random() * 30 + 15; // Longer animations for more drifting feel
      const delay = Math.random() * 3; 
      
      // Twinkle effect for some stars
      const twinkle = Math.random() > 0.7;
      const twinkleAnimation = twinkle ? 'twinkle 4s ease-in-out infinite' : '';
      
      // Glow effect based on size
      const glow = size > 1.5 ? `0 0 ${size * 2}px ${color}` : '';
      
      // Apply styles
      star.style.cssText = `
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
        box-shadow: ${glow};
        animation: float ${duration}s ease-in-out ${delay}s infinite${twinkle ? `, ${twinkleAnimation}` : ''};
        transform: translate(-50%, -50%);
      `;
      
      particlesContainer.appendChild(star);
      
      // Remove after animation
      setTimeout(() => {
        if (star.parentNode === particlesContainer) {
          particlesContainer.removeChild(star);
        }
      }, (duration + delay) * 1000);
    };
    
    // Create nebula effect
    const createNebula = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const nebula = document.createElement('div');
      nebula.classList.add('nebula');
      
      // Positioning
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Size and styling
      const size = Math.random() * 150 + 100;
      const opacity = Math.random() * 0.15 + 0.05; // Very subtle nebula
      
      // Color palette for nebulae
      const colors = theme === 'dark' 
        ? ['#7b58f680', '#2c9fff80', '#ff9d9d80', '#ba7dff80'] 
        : ['#7b58f640', '#2c9fff40', '#ff9d9d40', '#ba7dff40'];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Duration and movement
      const duration = Math.random() * 60 + 30; // Slow moving nebulae
      const delay = Math.random() * 5;
      
      // Apply styles
      nebula.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle at center, ${color} 0%, transparent 70%);
        opacity: ${opacity};
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: blur(${Math.random() * 20 + 10}px);
        animation: float-nebula ${duration}s ease-in-out ${delay}s infinite;
        transform: translate(-50%, -50%);
      `;
      
      particlesContainer.appendChild(nebula);
      
      // Remove after animation
      setTimeout(() => {
        if (nebula.parentNode === particlesContainer) {
          particlesContainer.removeChild(nebula);
        }
      }, (duration + delay) * 1000);
    };
    
    // Create initial stars and nebulae
    for (let i = 0; i < 60; i++) {
      createStar();
    }
    
    for (let i = 0; i < 8; i++) {
      createNebula();
    }
    
    // Continue creating stars and occasional nebulae
    const starInterval = setInterval(() => {
      createStar();
      
      // Occasionally create a new nebula
      if (Math.random() > 0.95) {
        createNebula();
      }
    }, 800);
    
    // Handle scroll interactions for parallax effect
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      if (Math.abs(scrollDelta) > 10) {
        // Create a few extra stars when scrolling
        for (let i = 0; i < 2; i++) {
          createStar();
        }
        
        // Parallax effect for existing stars and nebulae
        const stars = document.querySelectorAll('.star');
        const nebulae = document.querySelectorAll('.nebula');
        
        stars.forEach(star => {
          const speed = Math.random() * 0.05 + 0.02;
          // Cast to HTMLElement since Element doesn't have style property
          const htmlStar = star as HTMLElement;
          const currentY = parseFloat(htmlStar.style.top);
          htmlStar.style.top = `${currentY - scrollDelta * speed}px`;
        });
        
        nebulae.forEach(nebula => {
          const speed = Math.random() * 0.02 + 0.01; // Slower parallax for nebulae
          // Cast to HTMLElement since Element doesn't have style property
          const htmlNebula = nebula as HTMLElement;
          const currentY = parseFloat(htmlNebula.style.top);
          htmlNebula.style.top = `${currentY - scrollDelta * speed}px`;
        });
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(starInterval);
    };
  }, [theme]);
  
  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${theme}`}>
      <div 
        ref={particlesContainerRef} 
        id="particles-container" 
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
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
            
            @keyframes float-nebula {
              0% {
                transform: translate(-50%, -50%) scale(1);
              }
              50% {
                transform: translate(-50%, -50%) scale(1.1) translateY(${Math.random() * 20 - 10}px) translateX(${Math.random() * 20 - 10}px);
              }
              100% {
                transform: translate(-50%, -50%) scale(1);
              }
            }
            
            @keyframes twinkle {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.3;
              }
            }
          `
        }} />
      </div>
      <Header />
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
