
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
    /onload/gi,
    /onerror/gi,
    /onclick/gi,
    /onmouseover/gi,
    /<script/gi,
    /<\/script>/gi,
    /eval\(/gi,
    /expression\(/gi
  ];
  
  let cleaned = sanitized;
  xssPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Trim whitespace and limit length
  return cleaned.trim().substring(0, 5000);
};

export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email sanitization - remove potential XSS
  const sanitized = sanitizeInput(email).toLowerCase().trim();
  
  // Simple email validation with enhanced security
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional security - prevent email injection attacks
  const dangerousPatterns = [
    /\r|\n/g, // CRLF injection
    /bcc:/gi,
    /cc:/gi,
    /to:/gi,
    /from:/gi,
    /subject:/gi
  ];
  
  let cleaned = sanitized;
  dangerousPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return emailRegex.test(cleaned) ? cleaned : '';
};

export const sanitizeWalletAddress = (address: string): string => {
  if (!address || typeof address !== 'string') return '';
  
  // Remove any non-hex characters except 0x prefix and convert to lowercase
  const cleaned = address.trim().toLowerCase();
  
  // Validate Ethereum address format with strict validation
  const addressRegex = /^0x[a-f0-9]{40}$/;
  
  // Additional security - prevent injection attempts
  if (cleaned.includes('<') || cleaned.includes('>') || cleaned.includes('script')) {
    return '';
  }
  
  return addressRegex.test(cleaned) ? cleaned : '';
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'image/png', 
    'image/jpeg',
    'image/jpg'
  ];
  
  // Additional MIME type validation
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  return allowedTypes.includes(file.type) && allowedExtensions.includes(fileExtension);
};

export const validateFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes && file.size > 0; // Ensure file is not empty
};

// New security utilities
export const sanitizeNumericInput = (input: string | number): number | null => {
  if (typeof input === 'number') {
    return isFinite(input) ? input : null;
  }
  
  if (typeof input !== 'string') return null;
  
  // Remove any non-numeric characters except decimal point and minus sign
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isFinite(parsed) ? parsed : null;
};

export const validateUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Rate limiting utility for client-side
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
    return true;
  };
};
