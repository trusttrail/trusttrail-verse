
import { useMemo } from 'react';
import { ReviewFormData } from '@/hooks/useReviewForm';

interface UseFormValidationProps {
  formData: ReviewFormData;
  files: File[];
  isAuthenticated: boolean;
  isWalletConnected: boolean;
  existingUser: boolean | null;
  gitcoinVerified: boolean;
}

export const useFormValidation = ({
  formData,
  files,
  isAuthenticated,
  isWalletConnected,
  existingUser,
  gitcoinVerified,
}: UseFormValidationProps) => {
  const validationResults = useMemo(() => {
    // Updated form validation logic - allow wallet-only users with Gitcoin verification
    const isEffectivelyAuthenticated = isAuthenticated || isWalletConnected;
    
    // Check all required fields are filled
    const allFieldsFilled = formData.companyName.trim() && 
                           formData.category.trim() && 
                           formData.title.trim() && 
                           formData.review.trim() && 
                           formData.rating > 0;

    // Final form validation - wallet + gitcoin verification is sufficient
    const isFormValid = allFieldsFilled && 
                       isWalletConnected && 
                       gitcoinVerified;

    return {
      isEffectivelyAuthenticated,
      allFieldsFilled,
      isFormValid,
    };
  }, [formData, isAuthenticated, isWalletConnected, gitcoinVerified]);

  return validationResults;
};
