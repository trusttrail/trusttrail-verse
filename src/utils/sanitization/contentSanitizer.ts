
import { sanitizeInput } from './domSanitizer';

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
