
export const createCosmicNebula = (
  particlesContainer: HTMLDivElement | null,
  theme: string
) => {
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
  
  setTimeout(() => {
    if (nebula.parentNode === particlesContainer) {
      particlesContainer.removeChild(nebula);
    }
  }, (duration + delay) * 1000);
};
