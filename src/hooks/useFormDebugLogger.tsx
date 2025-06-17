
import { useEffect } from 'react';

interface FormDebugData {
  formData: {
    companyName: string;
    category: string;
    title: string;
    review: string;
    rating: number;
  };
  files: File[];
  isAuthenticated: boolean;
  isWalletConnected: boolean;
  existingUser: boolean | null;
  gitcoinVerified: boolean;
  allFieldsFilled: boolean;
  isEffectivelyAuthenticated: boolean;
  isFormValid: boolean;
}

export const useFormDebugLogger = (debugData: FormDebugData) => {
  useEffect(() => {
    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('formData.companyName:', debugData.formData.companyName);
    console.log('formData.category:', debugData.formData.category);
    console.log('formData.title:', debugData.formData.title);
    console.log('formData.review:', debugData.formData.review);
    console.log('formData.rating:', debugData.formData.rating);
    console.log('isAuthenticated:', debugData.isAuthenticated);
    console.log('isWalletConnected:', debugData.isWalletConnected);
    console.log('existingUser:', debugData.existingUser);
    console.log('gitcoinVerified:', debugData.gitcoinVerified);
    console.log('files.length:', debugData.files.length);
    console.log('allFieldsFilled:', debugData.allFieldsFilled);
    console.log('isEffectivelyAuthenticated:', debugData.isEffectivelyAuthenticated);
    console.log('Final isFormValid:', debugData.isFormValid);
    console.log('=== END FORM VALIDATION DEBUG ===');
  }, [debugData]);
};
