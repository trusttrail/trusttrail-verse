
import { useEffect, useRef } from 'react';

export const useParticleEffects = (theme: string) => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create Coldplay Coloratura-inspired stellar particles
    const createStellarParticle = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const particle = document.createElement('div');
      particle.classList.add('stellar-particle');
      
      // Random position with subtle mouse influence
      const mouseInfluence = 0.15;
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      
      const x = randomX * (1 - mouseInfluence) + mousePosition.current.x * mouseInfluence;
      const y = randomY * (1 - mouseInfluence) + mousePosition.current.y * mouseInfluence;
      
      // Coloratura-inspired properties
      const size = Math.random() * 4 + 1;
      const opacity = Math.random() * 0.9 + 0.3;
      
      // Cosmic color palette inspired by Coldplay's video
      const darkColors = [
        '#ffffff', '#e0f8ff', '#c4b5fd', '#fbbf24', '#f59e0b', 
        '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f97316'
      ];
      
      const lightColors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#06b6d4', '#f97316', '#ef4444', '#84cc16', '#f43f5e'
      ];
      
      const colors = theme === 'dark' ? darkColors : lightColors;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Enhanced animation durations for cosmic feel
      const duration = Math.random() * 40 + 20;
      const delay = Math.random() * 5;
      
      // Special effects for some particles
      const isSpecial = Math.random() > 0.7;
      const glowIntensity = isSpecial ? size * 3 : size;
      
      // Apply Coloratura-style animations
      const animationType = Math.random();
      let animation = `coloratura-float ${duration}s ease-in-out ${delay}s infinite`;
      
      if (animationType > 0.7) {
        animation += `, stellar-twinkle ${Math.random() * 8 + 4}s ease-in-out infinite`;
      } else if (animationType > 0.4 && theme === 'light') {
        animation = `solar-flare ${duration * 0.8}s ease-in-out ${delay}s infinite`;
      }
      
      // Enhanced glow effects
      const boxShadow = isSpecial 
        ? `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}80, 0 0 ${glowIntensity * 3}px ${color}40`
        : `0 0 ${glowIntensity}px ${color}`;
      
      particle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${color} 0%, ${color}80 70%, transparent 100%);
        opacity: ${opacity};
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        box-shadow: ${boxShadow};
        animation: ${animation};
        transform: translate(-50%, -50%);
      `;
      
      particlesContainer.appendChild(particle);
      
      // Remove after animation completes
      setTimeout(() => {
        if (particle.parentNode === particlesContainer) {
          particlesContainer.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };
    
    // Create cosmic nebula effects
    const createCosmicNebula = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const nebula = document.createElement('div');
      nebula.classList.add('cosmic-nebula');
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      const size = Math.random() * 200 + 150;
      const opacity = theme === 'dark' ? Math.random() * 0.2 + 0.1 : Math.random() * 0.15 + 0.05;
      
      // Cosmic nebula colors
      const darkNebulaColors = [
        '#7c3aed80', '#ec489980', '#f59e0b80', '#10b98180', '#06b6d480'
      ];
      
      const lightNebulaColors = [
        '#6366f160', '#ec489960', '#f59e0b60', '#10b98160', '#06b6d460'
      ];
      
      const nebulaColors = theme === 'dark' ? darkNebulaColors : lightNebulaColors;
      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      
      const duration = Math.random() * 80 + 40;
      const delay = Math.random() * 10;
      
      const blurAmount = Math.random() * 30 + 20;
      
      nebula.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(ellipse at center, ${color} 0%, ${color}60 40%, transparent 80%);
        opacity: ${opacity};
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: blur(${blurAmount}px);
        animation: ${theme === 'dark' ? 'nebula-pulse' : 'aurora-wave'} ${duration}s ease-in-out ${delay}s infinite;
        transform: translate(-50%, -50%);
      `;
      
      particlesContainer.appendChild(nebula);
      
      setTimeout(() => {
        if (nebula.parentNode === particlesContainer) {
          particlesContainer.removeChild(nebula);
        }
      }, (duration + delay) * 1000);
    };
    
    // Initialize with more particles for richer effect
    for (let i = 0; i < 80; i++) {
      setTimeout(() => createStellarParticle(), i * 100);
    }
    
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createCosmicNebula(), i * 500);
    }
    
    // Continuous particle generation
    const stellarInterval = setInterval(() => {
      createStellarParticle();
      
      // Occasionally create nebula
      if (Math.random() > 0.92) {
        createCosmicNebula();
      }
    }, 600);
    
    // Enhanced scroll parallax with cosmic drift
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      if (Math.abs(scrollDelta) > 8) {
        // Create burst of particles on significant scroll
        for (let i = 0; i < 3; i++) {
          setTimeout(() => createStellarParticle(), i * 200);
        }
        
        // Apply cosmic drift to existing particles
        const particles = document.querySelectorAll('.stellar-particle, .cosmic-nebula');
        particles.forEach((particle, index) => {
          const htmlParticle = particle as HTMLElement;
          const speed = (Math.random() * 0.08 + 0.02) * (index % 2 === 0 ? 1 : -1);
          const currentY = parseFloat(htmlParticle.style.top);
          htmlParticle.style.top = `${currentY - scrollDelta * speed}px`;
          
          // Add cosmic drift animation
          htmlParticle.style.animation += `, cosmic-drift ${Math.random() * 20 + 10}s ease-in-out infinite`;
        });
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(stellarInterval);
    };
  }, [theme]);

  return particlesContainerRef;
};
