
import { useRef } from 'react';

interface CacheData {
  address: string;
  exists: boolean;
  timestamp: number;
}

interface ProcessingData {
  address: string;
  timestamp: number;
  nonce: string;
}

interface AuthStateData {
  address: string;
  authenticated: boolean;
  timestamp: number;
}

export const useWalletCache = () => {
  const processingRef = useRef<ProcessingData | null>(null);
  const lastResultRef = useRef<CacheData | null>(null);
  const authStateRef = useRef<AuthStateData | null>(null);

  const isProcessing = (address: string, timeWindow: number = 3000) => {
    const now = Date.now();
    return processingRef.current && 
           processingRef.current.address === address && 
           (now - processingRef.current.timestamp) < timeWindow;
  };

  const getCachedResult = (address: string, cacheWindow: number = 60000) => {
    const now = Date.now();
    if (lastResultRef.current && 
        lastResultRef.current.address === address && 
        (now - lastResultRef.current.timestamp) < cacheWindow) {
      return lastResultRef.current;
    }
    return null;
  };

  const setProcessing = (address: string, nonce: string) => {
    processingRef.current = { address, timestamp: Date.now(), nonce };
  };

  const clearProcessing = () => {
    processingRef.current = null;
  };

  const setCachedResult = (address: string, exists: boolean) => {
    lastResultRef.current = {
      address,
      exists,
      timestamp: Date.now()
    };
  };

  const setAuthState = (address: string, authenticated: boolean) => {
    authStateRef.current = { address, authenticated, timestamp: Date.now() };
  };

  const getAuthState = () => authStateRef.current;

  const clearAuthState = () => {
    authStateRef.current = null;
  };

  const clearAllCache = () => {
    processingRef.current = null;
    lastResultRef.current = null;
    authStateRef.current = null;
  };

  return {
    isProcessing,
    getCachedResult,
    setProcessing,
    clearProcessing,
    setCachedResult,
    setAuthState,
    getAuthState,
    clearAuthState,
    clearAllCache,
  };
};
