
import { ReviewFormData } from '@/hooks/useReviewForm';

interface UseFormEventHandlersProps {
  handleSubmit: (e: React.FormEvent, formData: ReviewFormData) => Promise<void>;
  formData: ReviewFormData;
}

export const useFormEventHandlers = ({
  handleSubmit,
  formData,
}: UseFormEventHandlersProps) => {
  const onFormSubmit = async (e: React.FormEvent) => {
    console.log('🚀 EVENT HANDLER: Form submit event triggered');
    console.log('📋 EVENT HANDLER: Form data being submitted:', formData);
    
    e.preventDefault();
    
    console.log('✅ EVENT HANDLER: Calling handleSubmit function...');
    
    try {
      await handleSubmit(e, formData);
      console.log('✅ EVENT HANDLER: handleSubmit completed successfully');
    } catch (error) {
      console.error('❌ EVENT HANDLER: handleSubmit failed:', error);
    }
  };

  return {
    onFormSubmit,
  };
};
