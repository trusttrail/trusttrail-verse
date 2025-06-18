
export const createMilkyWayDust = (
  particlesContainer: HTMLDivElement | null,
  theme: string
) => {
  if (!particlesContainer) return;
  
  const dust = document.createElement('div');
  dust.classList.add('milky-way-dust');
  
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  
  const size = Math.random() * 300 + 200;
  const opacity = theme === 'dark' ? Math.random() * 0.15 + 0.05 : Math.random() * 0.1 + 0.03;
  
  // Milky Way dust colors
  const dustColors = theme === 'dark' 
    ? ['#7c3aed40', '#ec489940', '#f59e0b40', '#10b98140', '#06b6d440', '#c4b5fd30']
    : ['#6366f130', '#ec489930', '#f59e0b30', '#10b98130', '#06b6d430', '#a855f720'];
  
  const color = dustColors[Math.floor(Math.random() * dustColors.length)];
  
  const duration = Math.random() * 120 + 80;
  const delay = Math.random() * 15;
  
  const blurAmount = Math.random() * 50 + 30;
  
  dust.style.cssText = `
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
    animation: milky-way-dust ${duration}s ease-in-out ${delay}s infinite;
    transform: translate(-50%, -50%);
  `;
  
  particlesContainer.appendChild(dust);
  
  setTimeout(() => {
    if (dust.parentNode === particlesContainer) {
      particlesContainer.removeChild(dust);
    }
  }, (duration + delay) * 1000);
};
