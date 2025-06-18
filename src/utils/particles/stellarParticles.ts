
export const createStellarParticle = (
  particlesContainer: HTMLDivElement | null,
  mousePosition: { x: number; y: number },
  theme: string
) => {
  if (!particlesContainer) return;
  
  const particle = document.createElement('div');
  particle.classList.add('stellar-particle');
  
  // Random position with subtle mouse influence
  const mouseInfluence = 0.15;
  const randomX = Math.random() * window.innerWidth;
  const randomY = Math.random() * window.innerHeight;
  
  const x = randomX * (1 - mouseInfluence) + mousePosition.x * mouseInfluence;
  const y = randomY * (1 - mouseInfluence) + mousePosition.y * mouseInfluence;
  
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
