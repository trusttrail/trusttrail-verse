
// Main barrel export file for all sanitization utilities
export { sanitizeInput, purify } from './sanitization/domSanitizer';
export { sanitizeEmail } from './sanitization/emailSanitizer';
export { sanitizeWalletAddress } from './sanitization/walletSanitizer';

// Export MAXIMUM SECURITY wallet operations
export { 
  findWalletProfileByAddress, 
  createWalletProfileSecurely, 
  getOrCreateWalletProfileSecurely 
} from './walletSecurity';

// Export security audit logging
export { 
  logSecurityAction, 
  logWalletAccess, 
  logAuthEvent 
} from './security/auditLogger';
export { validateFileType, validateFileSize } from './sanitization/fileSanitizer';
export { 
  sanitizeNumericInput, 
  validateUrl, 
  sanitizeReviewContent 
} from './sanitization/contentSanitizer';
export { createRateLimiter, generateSecureToken } from './security/rateLimiter';
