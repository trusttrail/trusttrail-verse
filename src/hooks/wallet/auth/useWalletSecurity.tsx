
import { useRef } from 'react';
import { sanitizeWalletAddress, createRateLimiter, generateSecureToken } from '@/utils/inputSanitization';
import { useToast } from '@/hooks/use-toast';

// Rate limiting configuration
const walletOperationLimiter = createRateLimiter(10, 60000); // 10 attempts per minute
const authAttemptLimiter = createRateLimiter(15, 300000); // 15 attempts per 5 minutes

export const useWalletSecurity = () => {
  const { toast } = useToast();
  const failedAttemptsRef = useRef<Map<string, { count: number; lastAttempt: number }>>(new Map());
  const notificationHistoryRef = useRef<Set<string>>(new Set());

  const sanitizeAndValidateWallet = (address: string) => {
    console.log('Input address:', address);
    
    const sanitizedAddress = sanitizeWalletAddress(address);
    if (!sanitizedAddress) {
      console.error('❌ Invalid wallet address format');
      toast({
        title: "Invalid Wallet Address",
        description: "The wallet address format is invalid or contains malicious content.",
        variant: "destructive",
      });
      return null;
    }
    
    return sanitizedAddress;
  };

  const checkRateLimit = (address: string) => {
    const now = Date.now();
    const failedAttempts = failedAttemptsRef.current.get(address);
    
    if (failedAttempts && failedAttempts.count >= 5) {
      // Reset failed attempts after 10 minutes
      if (now - failedAttempts.lastAttempt > 600000) {
        failedAttemptsRef.current.delete(address);
      } else {
        console.log('🚫 Too many failed attempts for this address');
        toast({
          title: "Temporary Rate Limit",
          description: "Please wait a few minutes before trying again.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Check rate limiting
    if (!walletOperationLimiter(address) || !authAttemptLimiter(address)) {
      console.log('⚠️ Rate limit exceeded for wallet operations');
      return false;
    }

    return true;
  };

  const recordFailedAttempt = (address: string) => {
    const now = Date.now();
    const currentFailed = failedAttemptsRef.current.get(address) || { count: 0, lastAttempt: 0 };
    failedAttemptsRef.current.set(address, { 
      count: currentFailed.count + 1, 
      lastAttempt: now 
    });
  };

  const clearFailedAttempts = (address: string) => {
    failedAttemptsRef.current.delete(address);
  };

  const showNotificationOnce = (key: string, title: string, description: string, variant?: 'destructive') => {
    if (!notificationHistoryRef.current.has(key)) {
      notificationHistoryRef.current.add(key);
      toast({ title, description, variant });
    }
  };

  const generateSessionNonce = () => generateSecureToken();

  return {
    sanitizeAndValidateWallet,
    checkRateLimit,
    recordFailedAttempt,
    clearFailedAttempts,
    showNotificationOnce,
    generateSessionNonce,
  };
};
