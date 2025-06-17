
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
}

interface FailedAttempts {
  [address: string]: {
    count: number;
    lastAttempt: number;
  };
}

export const useWalletSecurity = () => {
  const { toast } = useToast();
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    blocked: false
  });
  const [failedAttempts, setFailedAttempts] = useState<FailedAttempts>({});
  const [notificationCache, setNotificationCache] = useState<Set<string>>(new Set());

  const sanitizeAndValidateWallet = useCallback((address: string): string | null => {
    if (!address || typeof address !== 'string') return null;
    
    const cleaned = address.toLowerCase().trim();
    
    // Basic Ethereum address validation
    if (!/^0x[a-f0-9]{40}$/.test(cleaned)) {
      console.warn('Invalid wallet address format:', address);
      return null;
    }
    
    return cleaned;
  }, []);

  const checkRateLimit = useCallback((operation: string): boolean => {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    const maxAttempts = 5;
    
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

  const recordFailedAttempt = useCallback((address: string) => {
    const now = Date.now();
    setFailedAttempts(prev => ({
      ...prev,
      [address]: {
        count: (prev[address]?.count || 0) + 1,
        lastAttempt: now
      }
    }));
  }, []);

  const clearFailedAttempts = useCallback((address: string) => {
    setFailedAttempts(prev => {
      const updated = { ...prev };
      delete updated[address];
      return updated;
    });
  }, []);

  const showNotificationOnce = useCallback((
    key: string, 
    title: string, 
    description: string, 
    variant: 'default' | 'destructive' = 'default'
  ) => {
    if (!notificationCache.has(key)) {
      toast({ title, description, variant });
      setNotificationCache(prev => new Set(prev).add(key));
    }
  }, [toast, notificationCache]);

  const generateSessionNonce = useCallback((): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

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
    sanitizeAndValidateWallet,
    checkRateLimit,
    recordFailedAttempt,
    clearFailedAttempts,
    showNotificationOnce,
    generateSessionNonce,
    resetRateLimit,
    generateSecureToken,
    isRateLimited: rateLimitState.blocked
  };
};
