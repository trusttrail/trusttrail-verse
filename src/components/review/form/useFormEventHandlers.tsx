
import { ReviewFormData } from '@/hooks/useReviewForm';

interface UseFormEventHandlersProps {
  handleSubmit: (e: React.FormEvent, formData: ReviewFormData) => Promise<void>;
  formData: ReviewFormData;
}

export const useFormEventHandlers = ({
  handleSubmit,
  formData,
}: UseFormEventHandlersProps) => {
  const onFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, formData);
  };

  return {
    onFormSubmit,
  };
};
