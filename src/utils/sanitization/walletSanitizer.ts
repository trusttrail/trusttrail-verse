
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
