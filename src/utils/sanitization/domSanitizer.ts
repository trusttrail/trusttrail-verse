
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

export const purify = createDOMPurify();

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
