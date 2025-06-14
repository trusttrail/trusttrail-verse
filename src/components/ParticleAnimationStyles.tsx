
import React from 'react';

const ParticleAnimationStyles: React.FC = () => {
  return (
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
  );
};

export default ParticleAnimationStyles;
