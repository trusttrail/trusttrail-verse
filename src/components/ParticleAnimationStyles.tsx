
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

const ParticleAnimationStyles: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Coldplay Coloratura-inspired animations */
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
            opacity: ${theme === 'dark' ? '0.3' : '0.2'};
          }
          33% {
            transform: translate(-50%, -50%) scale(1.3) rotate(120deg) translateY(${Math.random() * 40 - 20}px);
            opacity: ${theme === 'dark' ? '0.5' : '0.4'};
          }
          66% {
            transform: translate(-50%, -50%) scale(0.8) rotate(240deg) translateX(${Math.random() * 40 - 20}px);
            opacity: ${theme === 'dark' ? '0.2' : '0.15'};
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: ${theme === 'dark' ? '0.3' : '0.2'};
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
            transform: translate(-50%, -50%) scale(1.2);
            filter: brightness(1.5) hue-rotate(90deg);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.8);
            filter: brightness(0.8) hue-rotate(180deg);
          }
          75% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
            filter: brightness(1.2) hue-rotate(270deg);
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
      `
    }} />
  );
};

export default ParticleAnimationStyles;
