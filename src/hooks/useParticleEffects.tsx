
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
    
    // Create enhanced stellar particles for Milky Way effect
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
      
      // Enhanced properties for galaxy feel
      const size = Math.random() * 5 + 1;
      const opacity = Math.random() * 0.9 + 0.3;
      
      // Enhanced cosmic color palette for Milky Way
      const darkColors = [
        '#ffffff', '#e0f8ff', '#c4b5fd', '#fbbf24', '#f59e0b', 
        '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f97316',
        '#ddd6fe', '#fde68a', '#f3e8ff', '#ecfeff'
      ];
      
      const lightColors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#06b6d4', '#f97316', '#ef4444', '#84cc16', '#f43f5e',
        '#a855f7', '#eab308', '#059669', '#0891b2'
      ];
      
      const colors = theme === 'dark' ? darkColors : lightColors;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Enhanced animation durations for cosmic feel
      const duration = Math.random() * 50 + 25;
      const delay = Math.random() * 8;
      
      // Special effects for some particles
      const isSpecial = Math.random() > 0.6;
      const glowIntensity = isSpecial ? size * 4 : size * 2;
      
      // Apply enhanced animations
      const animationType = Math.random();
      let animation = `coloratura-float ${duration}s ease-in-out ${delay}s infinite`;
      
      if (animationType > 0.7) {
        animation += `, stellar-twinkle ${Math.random() * 10 + 6}s ease-in-out infinite`;
      } else if (animationType > 0.4 && theme === 'light') {
        animation = `solar-flare ${duration * 0.8}s ease-in-out ${delay}s infinite`;
      } else if (animationType > 0.2) {
        animation += `, galaxy-spiral ${duration * 1.2}s linear infinite`;
      }
      
      // Enhanced glow effects for galaxy feel
      const boxShadow = isSpecial 
        ? `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}80, 0 0 ${glowIntensity * 4}px ${color}40, 0 0 ${glowIntensity * 6}px ${color}20`
        : `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}60`;
      
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

    // NEW: Create shooting stars
    const createShootingStar = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const shootingStar = document.createElement('div');
      shootingStar.classList.add('shooting-star');
      
      // Random starting position (top-left area)
      const startX = Math.random() * (window.innerWidth * 0.3);
      const startY = Math.random() * (window.innerHeight * 0.3);
      
      const width = Math.random() * 3 + 2;
      const height = Math.random() * 100 + 80;
      const duration = Math.random() * 3 + 2;
      
      // Shooting star colors
      const colors = theme === 'dark' 
        ? ['#ffffff', '#fbbf24', '#06b6d4', '#c4b5fd', '#fde68a']
        : ['#6366f1', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      shootingStar.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: ${width}px;
        height: ${height}px;
        background: linear-gradient(45deg, ${color} 0%, ${color}80 50%, transparent 100%);
        border-radius: 50px;
        pointer-events: none;
        z-index: 1;
        animation: shooting-star ${duration}s ease-out;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color}80, 0 0 30px ${color}40;
      `;
      
      particlesContainer.appendChild(shootingStar);
      
      setTimeout(() => {
        if (shootingStar.parentNode === particlesContainer) {
          particlesContainer.removeChild(shootingStar);
        }
      }, duration * 1000);
    };

    // NEW: Create Milky Way dust clouds
    const createMilkyWayDust = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const dust = document.createElement('div');
      dust.classList.add('milky-way-dust');
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      const size = Math.random() * 300 + 200;
      const opacity = theme === 'dark' ? Math.random() * 0.15 + 0.05 : Math.random() * 0.1 + 0.03;
      
      // Milky Way dust colors
      const dustColors = theme === 'dark' 
        ? ['#7c3aed40', '#ec489940', '#f59e0b40', '#10b98140', '#06b6d440', '#c4b5fd30']
        : ['#6366f130', '#ec489930', '#f59e0b30', '#10b98130', '#06b6d430', '#a855f720'];
      
      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      
      const duration = Math.random() * 120 + 80;
      const delay = Math.random() * 15;
      
      const blurAmount = Math.random() * 50 + 30;
      
      dust.style.cssText = `
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
        animation: milky-way-dust ${duration}s ease-in-out ${delay}s infinite;
        transform: translate(-50%, -50%);
      `;
      
      particlesContainer.appendChild(dust);
      
      setTimeout(() => {
        if (dust.parentNode === particlesContainer) {
          particlesContainer.removeChild(dust);
        }
      }, (duration + delay) * 1000);
    };

    // NEW: Create comet trails occasionally
    const createCometTrail = () => {
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;
      
      const comet = document.createElement('div');
      comet.classList.add('comet-trail');
      
      const duration = Math.random() * 4 + 3;
      const delay = Math.random() * 2;
      
      const colors = theme === 'dark' 
        ? ['#fbbf24', '#06b6d4', '#c4b5fd', '#ffffff']
        : ['#f59e0b', '#0891b2', '#8b5cf6', '#6366f1'];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      comet.style.cssText = `
        position: absolute;
        background: linear-gradient(30deg, ${color} 0%, ${color}80 30%, transparent 100%);
        border-radius: 50px;
        pointer-events: none;
        z-index: 1;
        animation: comet-trail ${duration}s ease-out ${delay}s;
        box-shadow: 0 0 15px ${color}, 0 0 30px ${color}60;
      `;
      
      particlesContainer.appendChild(comet);
      
      setTimeout(() => {
        if (comet.parentNode === particlesContainer) {
          particlesContainer.removeChild(comet);
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
      
      const size = Math.random() * 250 + 180;
      const opacity = theme === 'dark' ? Math.random() * 0.3 + 0.15 : Math.random() * 0.2 + 0.08;
      
      // Enhanced cosmic nebula colors
      const darkNebulaColors = [
        '#7c3aed80', '#ec489980', '#f59e0b80', '#10b98180', '#06b6d480', '#c4b5fd70'
      ];
      
      const lightNebulaColors = [
        '#6366f160', '#ec489960', '#f59e0b60', '#10b98160', '#06b6d460', '#a855f750'
      ];
      
      const nebulaColors = theme === 'dark' ? darkNebulaColors : lightNebulaColors;
      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      
      const duration = Math.random() * 100 + 60;
      const delay = Math.random() * 12;
      
      const blurAmount = Math.random() * 40 + 25;
      
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
      
      setTimeout(() =>... [This is where the rest of the file contents continue. Since this is getting long, I'll provide the rest of the logic to close it properly]
