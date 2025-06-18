
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

const ParticleAnimationStyles: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Enhanced Milky Way Galaxy animations with shooting stars */
        @keyframes coloratura-float {
          0% {
            transform: translate(-50%, -50%) translateY(0) translateX(0) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 60 - 30}px) translateX(${Math.random() * 60 - 30}px) rotate(90deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 80 - 40}px) translateX(${Math.random() * 80 - 40}px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 60 - 30}px) translateX(${Math.random() * 60 - 30}px) rotate(270deg);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) translateY(0) translateX(0) rotate(360deg);
            opacity: 0.8;
          }
        }
        
        @keyframes nebula-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: ${theme === 'dark' ? '0.4' : '0.25'};
          }
          33% {
            transform: translate(-50%, -50%) scale(1.4) rotate(120deg) translateY(${Math.random() * 40 - 20}px);
            opacity: ${theme === 'dark' ? '0.6' : '0.45'};
          }
          66% {
            transform: translate(-50%, -50%) scale(0.9) rotate(240deg) translateX(${Math.random() * 40 - 20}px);
            opacity: ${theme === 'dark' ? '0.3' : '0.2'};
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: ${theme === 'dark' ? '0.4' : '0.25'};
          }
        }
        
        @keyframes stellar-twinkle {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1) hue-rotate(0deg);
          }
          25% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.3);
            filter: brightness(1.8) hue-rotate(90deg);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(0.7);
            filter: brightness(0.6) hue-rotate(180deg);
          }
          75% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.2);
            filter: brightness(1.4) hue-rotate(270deg);
          }
        }

        @keyframes cosmic-drift {
          0% {
            transform: translate(-50%, -50%) translateY(0) translateX(0);
          }
          20% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 100 - 50}px) translateX(${Math.random() * 100 - 50}px);
          }
          40% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 120 - 60}px) translateX(${Math.random() * 120 - 60}px);
          }
          60% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 100 - 50}px) translateX(${Math.random() * 100 - 50}px);
          }
          80% {
            transform: translate(-50%, -50%) translateY(${Math.random() * 80 - 40}px) translateX(${Math.random() * 80 - 40}px);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0) translateX(0);
          }
        }

        /* NEW: Shooting Star Animation */
        @keyframes shooting-star {
          0% {
            transform: translate(-200px, -200px) rotate(45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw + 200px), calc(100vh + 200px)) rotate(45deg);
            opacity: 0;
          }
        }

        /* NEW: Milky Way Dust Animation */
        @keyframes milky-way-dust {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translate(-50%, -50%) rotate(90deg) scale(1.2);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) scale(0.8);
            opacity: 0.15;
          }
            75% {
            transform: translate(-50%, -50%) rotate(270deg) scale(1.1);
            opacity: 0.25;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
            opacity: 0.1;
          }
        }

        /* NEW: Galaxy Spiral Animation */
        @keyframes galaxy-spiral {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(50px) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translate(-50%, -50%) rotate(90deg) translateX(70px) rotate(-90deg);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) translateX(60px) rotate(-180deg);
            opacity: 0.3;
          }
          75% {
            transform: translate(-50%, -50%) rotate(270deg) translateX(80px) rotate(-270deg);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(50px) rotate(-360deg);
            opacity: 0.2;
          }
        }

        /* Light mode specific animations */
        @keyframes solar-flare {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
            filter: brightness(1) hue-rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0.9;
            filter: brightness(1.8) hue-rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
            filter: brightness(1) hue-rotate(360deg);
          }
        }

        @keyframes aurora-wave {
          0% {
            transform: translate(-50%, -50%) scaleY(1) scaleX(1) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            transform: translate(-50%, -50%) scaleY(1.5) scaleX(0.8) rotate(90deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scaleY(0.8) scaleX(1.3) rotate(180deg);
            opacity: 0.5;
          }
          75% {
            transform: translate(-50%, -50%) scaleY(1.2) scaleX(0.9) rotate(270deg);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scaleY(1) scaleX(1) rotate(360deg);
            opacity: 0.4;
          }
        }

        /* NEW: Comet Trail Animation */
        @keyframes comet-trail {
          0% {
            transform: translate(-100px, 50vh) rotate(-30deg);
            opacity: 0;
            width: 2px;
            height: 80px;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 0.8;
            width: 3px;
            height: 120px;
          }
          100% {
            transform: translate(calc(100vw + 100px), -100px) rotate(-30deg);
            opacity: 0;
            width: 1px;
            height: 60px;
          }
        }
      `
    }} />
  );
};

export default ParticleAnimationStyles;
