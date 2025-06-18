
export const createCometTrail = (
  particlesContainer: HTMLDivElement | null,
  theme: string
) => {
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
