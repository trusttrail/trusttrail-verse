
import { useEffect, useRef } from 'react';
import { createStellarParticle } from '@/utils/particles/stellarParticles';
import { createShootingStar } from '@/utils/particles/shootingStars';
import { createMilkyWayDust } from '@/utils/particles/milkyWayDust';
import { createCometTrail } from '@/utils/particles/cometTrails';
import { createCosmicNebula } from '@/utils/particles/cosmicNebula';

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
    
    // Enhanced particle creation with better intervals for more density
    const stellarInterval = setInterval(() => {
      createStellarParticle(particlesContainerRef.current, mousePosition.current, theme);
    }, Math.random() * 300 + 150); // More frequent stellar particles

    // Create multiple stellar particles on initial load
    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          createStellarParticle(particlesContainerRef.current, mousePosition.current, theme);
        }, i * 100);
      }
    }, 500);

    const nebulaInterval = setInterval(() => {
      createCosmicNebula(particlesContainerRef.current, theme);
    }, Math.random() * 6000 + 4000); // More frequent nebula

    const shootingStarInterval = setInterval(() => {
      createShootingStar(particlesContainerRef.current, theme);
    }, Math.random() * 12000 + 8000); // More frequent shooting stars

    const dustInterval = setInterval(() => {
      createMilkyWayDust(particlesContainerRef.current, theme);
    }, Math.random() * 4000 + 2000); // More frequent dust

    const cometInterval = setInterval(() => {
      createCometTrail(particlesContainerRef.current, theme);
    }, Math.random() * 15000 + 10000); // More frequent comets

    // Create initial background particles for immediate effect
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          createMilkyWayDust(particlesContainerRef.current, theme);
        }, i * 200);
      }
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          createCosmicNebula(particlesContainerRef.current, theme);
        }, i * 500);
      }
    }, 1000);

    // Handle scroll effects with more particles
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      if (Math.abs(scrollDelta) > 30) {  // Lower threshold for more responsiveness
        // Create additional particles on scroll
        if (Math.random() > 0.5) { // Higher chance
          createStellarParticle(particlesContainerRef.current, mousePosition.current, theme);
        }
        if (Math.random() > 0.8) {
          createMilkyWayDust(particlesContainerRef.current, theme);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(stellarInterval);
      clearInterval(nebulaInterval);
      clearInterval(shootingStarInterval);
      clearInterval(dustInterval);
      clearInterval(cometInterval);
    };
  }, [theme]);

  return particlesContainerRef;
};
