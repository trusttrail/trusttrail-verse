
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
  
  // Trim whitespace and limit length
  return sanitized.trim().substring(0, 5000);
};

export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email sanitization
  const sanitized = email.toLowerCase().trim();
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizeWalletAddress = (address: string): string => {
  if (!address || typeof address !== 'string') return '';
  
  // Remove any non-hex characters except 0x prefix
  const cleaned = address.trim();
  
  // Validate Ethereum address format
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(cleaned) ? cleaned : '';
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'image/png', 
    'image/jpeg',
    'image/jpg'
  ];
  
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};
