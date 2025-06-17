
import { useState, useCallback } from 'react';

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
}

export const useWalletSecurity = () => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    blocked: false
  });

  const checkRateLimit = useCallback((operation: string): boolean => {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    const maxAttempts = 3; // Reduced from 5 to prevent spam
    
    // Reset if outside time window
    if (now - rateLimitState.lastAttempt > timeWindow) {
      setRateLimitState({
        attempts: 1,
        lastAttempt: now,
        blocked: false
      });
      return false;
    }
    
    // Check if rate limited
    if (rateLimitState.attempts >= maxAttempts) {
      console.warn(`⚠️ Rate limit exceeded for ${operation}`);
      setRateLimitState(prev => ({ ...prev, blocked: true }));
      return true;
    }
    
    // Increment attempts
    setRateLimitState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      lastAttempt: now
    }));
    
    return false;
  }, [rateLimitState]);

  const resetRateLimit = useCallback(() => {
    setRateLimitState({
      attempts: 0,
      lastAttempt: 0,
      blocked: false
    });
  }, []);

  const generateSecureToken = useCallback((): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  return {
    checkRateLimit,
    resetRateLimit,
    generateSecureToken,
    isRateLimited: rateLimitState.blocked
  };
};
