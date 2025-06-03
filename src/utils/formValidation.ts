
import { sanitizeInput } from "./inputSanitization";

export interface ReviewFormData {
  companyName: string;
  category: string;
  rating: number;
  title: string;
  review: string;
  pros: string;
  cons: string;
}

export const validateReviewForm = (formData: ReviewFormData): string | null => {
  // Sanitize inputs first
  const sanitizedCompany = sanitizeInput(formData.companyName);
  const sanitizedCategory = sanitizeInput(formData.category);
  const sanitizedTitle = sanitizeInput(formData.title);
  const sanitizedContent = sanitizeInput(formData.review);

  // Check required fields
  if (!sanitizedCompany || sanitizedCompany.length < 2) {
    return "Company name is required and must be at least 2 characters";
  }

  if (!sanitizedCategory) {
    return "Category is required";
  }

  if (!sanitizedTitle || sanitizedTitle.length < 5) {
    return "Review title is required and must be at least 5 characters";
  }

  if (!sanitizedContent || sanitizedContent.length < 20) {
    return "Review content is required and must be at least 20 characters";
  }

  // Validate rating
  if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
    return "Rating must be between 1 and 5";
  }

  // Check for reasonable length limits
  if (sanitizedCompany.length > 100) {
    return "Company name must be less than 100 characters";
  }

  if (sanitizedTitle.length > 200) {
    return "Review title must be less than 200 characters";
  }

  if (sanitizedContent.length > 5000) {
    return "Review content must be less than 5000 characters";
  }

  // Check for spam patterns (basic)
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /(http|www\.)/gi, // URLs (basic check)
    /[^\w\s\.\,\!\?\-\(\)]/g // Excessive special characters
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(sanitizedContent) || pattern.test(sanitizedTitle)) {
      return "Content contains suspicious patterns. Please revise your review.";
    }
  }

  return null;
};

export const validateWalletAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;
  
  // Ethereum address validation
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumRegex.test(address.trim());
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase().trim());
};
