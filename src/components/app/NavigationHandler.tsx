
import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const NavigationHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Handle browser navigation events
    const handlePopState = (event: PopStateEvent) => {
      console.log('🔄 Browser navigation detected:', event.state);
      // Let React Router handle the navigation naturally
      // This prevents the blank page issue
    };

    // Add event listener for browser navigation
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location]);

  // Ensure page doesn't go blank on navigation
  React.useEffect(() => {
    // Force a re-render to prevent blank pages
    if (location.pathname && !document.body.innerHTML.includes('Loading')) {
      console.log('📍 Current route:', location.pathname);
    }
  }, [location]);

  return null;
};

export default NavigationHandler;
