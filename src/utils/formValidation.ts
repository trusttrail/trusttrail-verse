
import { ReviewFormData } from '@/hooks/useReviewForm';

export const validateReviewForm = (formData: ReviewFormData): string | null => {
  if (!formData.companyName || !formData.category || !formData.rating || !formData.title || !formData.review) {
    return "Please fill in all required fields.";
  }
  return null;
};
