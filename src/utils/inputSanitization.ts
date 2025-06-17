// Main barrel export file for all sanitization utilities
export { sanitizeInput, purify } from './sanitization/domSanitizer';
export { sanitizeEmail } from './sanitization/emailSanitizer';
export { sanitizeWalletAddress } from './sanitization/walletSanitizer';
export { validateFileType, validateFileSize } from './sanitization/fileSanitizer';
export { 
  sanitizeNumericInput, 
  validateUrl, 
  sanitizeReviewContent 
} from './sanitization/contentSanitizer';
export { createRateLimiter, generateSecureToken } from './security/rateLimiter';

import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML sanitization
const createDOMPurify = () => {
  if (typeof window !== 'undefined') {
    return DOMPurify;
  }
  // For server-side rendering, create a JSDOM instance
  const createDOMPurifyServer = require('dompurify');
  const { JSDOM } = require('jsdom');
  const jsdomWindow = new JSDOM('').window;
  return createDOMPurifyServer(jsdomWindow);
};

const purify = createDOMPurify();

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove any HTML tags and decode HTML entities
  const sanitized = purify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
  
  // Additional XSS prevention - remove potentially dangerous patterns
  const xssPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /onload/gi,
    /onerror/gi,
    /onclick/gi,
    /onmouseover/gi,
    /onfocus/gi,
    /onblur/gi,
    /<script/gi,
    /<\/script>/gi,
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
    /eval\(/gi,
    /expression\(/gi,
    /import\(/gi,
    /require\(/gi
  ];
  
  let cleaned = sanitized;
  xssPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Trim whitespace and limit length to prevent DoS
  return cleaned.trim().substring(0, 10000);
};

export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email sanitization - remove potential XSS
  const sanitized = sanitizeInput(email).toLowerCase().trim();
  
  // Enhanced email validation with stricter rules
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Additional security - prevent email injection attacks
  const dangerousPatterns = [
    /\r|\n/g, // CRLF injection
    /bcc:/gi,
    /cc:/gi,
    /to:/gi,
    /from:/gi,
    /subject:/gi,
    /content-type:/gi,
    /mime-version:/gi
  ];
  
  let cleaned = sanitized;
  dangerousPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Length validation
  if (cleaned.length > 254) return '';
  
  return emailRegex.test(cleaned) ? cleaned : '';
};

export const sanitizeWalletAddress = (address: string): string => {
  if (!address || typeof address !== 'string') return '';
  
  // Remove any non-hex characters except 0x prefix and convert to lowercase
  const cleaned = address.trim().toLowerCase();
  
  // Validate Ethereum address format with strict validation
  const addressRegex = /^0x[a-f0-9]{40}$/;
  
  // Additional security - prevent injection attempts
  const dangerousPatterns = [
    /<[^>]*>/g, // HTML tags
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /on\w+=/gi // Event handlers
  ];
  
  let secureAddress = cleaned;
  dangerousPatterns.forEach(pattern => {
    secureAddress = secureAddress.replace(pattern, '');
  });
  
  return addressRegex.test(secureAddress) ? secureAddress : '';
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'image/png', 
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ];
  
  // Additional MIME type validation
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  // Check both MIME type and extension for double validation
  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.includes(fileExtension);
  
  // Additional security check for file name
  const hasValidName = !/[<>:"/\\|?*\x00-\x1f]/.test(file.name);
  
  return isValidType && isValidExtension && hasValidName;
};

export const validateFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes && file.size > 0; // Ensure file is not empty
};

// Enhanced security utilities
export const sanitizeNumericInput = (input: string | number): number | null => {
  if (typeof input === 'number') {
    return isFinite(input) && !isNaN(input) ? input : null;
  }
  
  if (typeof input !== 'string') return null;
  
  // Remove any non-numeric characters except decimal point and minus sign
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  // Additional validation for safety
  if (!isFinite(parsed) || isNaN(parsed)) return null;
  if (Math.abs(parsed) > Number.MAX_SAFE_INTEGER) return null;
  
  return parsed;
};

export const validateUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string' || url.length > 2048) return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Enhanced rate limiting utility for client-side
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, number[]>();
  
  return (key: string): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    validAttempts.push(now);
    attempts.set(key, validAttempts);
    
    // Clean up old entries periodically
    if (attempts.size > 1000) {
      attempts.clear();
    }
    
    return true;
  };
};

// Content Security Policy helper
export const sanitizeReviewContent = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  // Apply base sanitization
  let sanitized = sanitizeInput(content);
  
  // Additional review-specific sanitization
  const reviewPatterns = [
    /<[^>]*>/g, // Remove all HTML tags
    /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?\b/g, // Remove URLs
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Remove email addresses
  ];
  
  reviewPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });
  
  // Limit length for reviews
  return sanitized.substring(0, 5000);
};

// Secure token generation for client-side nonces
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
