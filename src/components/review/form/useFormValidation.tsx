
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

    // Debug logging to help troubleshoot form validation issues
    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('formData.companyName:', `"${formData.companyName}"`);
    console.log('formData.category:', `"${formData.category}"`);
    console.log('formData.title:', `"${formData.title}"`);
    console.log('formData.review:', `"${formData.review.substring(0, 50)}..."`);
    console.log('formData.rating:', formData.rating);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isWalletConnected:', isWalletConnected);
    console.log('existingUser:', existingUser);
    console.log('gitcoinVerified:', gitcoinVerified);
    console.log('files.length:', files.length);
    console.log('allFieldsFilled:', allFieldsFilled);
    console.log('isEffectivelyAuthenticated:', isEffectivelyAuthenticated);
    console.log('Final isFormValid:', isFormValid);
    console.log('=== END FORM VALIDATION DEBUG ===');

    return {
      isEffectivelyAuthenticated,
      allFieldsFilled,
      isFormValid,
    };
  }, [formData, files, isAuthenticated, isWalletConnected, existingUser, gitcoinVerified]);

  return validationResults;
};
