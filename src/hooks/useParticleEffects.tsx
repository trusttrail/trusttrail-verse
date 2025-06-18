
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
    
    // Particle creation intervals
    const stellarInterval = setInterval(() => {
      createStellarParticle(particlesContainerRef.current, mousePosition.current, theme);
    }, Math.random() * 400 + 200);

    const nebulaInterval = setInterval(() => {
      createCosmicNebula(particlesContainerRef.current, theme);
    }, Math.random() * 8000 + 5000);

    const shootingStarInterval = setInterval(() => {
      createShootingStar(particlesContainerRef.current, theme);
    }, Math.random() * 15000 + 10000);

    const dustInterval = setInterval(() => {
      createMilkyWayDust(particlesContainerRef.current, theme);
    }, Math.random() * 6000 + 4000);

    const cometInterval = setInterval(() => {
      createCometTrail(particlesContainerRef.current, theme);
    }, Math.random() * 20000 + 15000);

    // Handle scroll effects
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      if (Math.abs(scrollDelta) > 50) {
        // Create additional particles on scroll
        if (Math.random() > 0.7) {
          createStellarParticle(particlesContainerRef.current, mousePosition.current, theme);
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
