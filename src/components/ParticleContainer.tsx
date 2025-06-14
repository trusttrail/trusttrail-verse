
import React from 'react';
import { useParticleEffects } from '@/hooks/useParticleEffects';
import ParticleAnimationStyles from './ParticleAnimationStyles';

interface ParticleContainerProps {
  theme: string;
}

const ParticleContainer: React.FC<ParticleContainerProps> = ({ theme }) => {
  const particlesContainerRef = useParticleEffects(theme);

  return (
    <>
      <div 
        ref={particlesContainerRef} 
        id="particles-container" 
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      >
        <ParticleAnimationStyles />
      </div>
    </>
  );
};

export default ParticleContainer;
