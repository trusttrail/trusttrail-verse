
import { sanitizeInput } from './domSanitizer';

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
