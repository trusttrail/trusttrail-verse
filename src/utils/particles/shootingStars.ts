
export const createShootingStar = (
  particlesContainer: HTMLDivElement | null,
  theme: string
) => {
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
