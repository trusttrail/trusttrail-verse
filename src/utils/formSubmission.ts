
import { ReviewFormData } from '@/hooks/useReviewForm';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from './inputSanitization';

export interface SubmissionResult {
  success: boolean;
  message: string;
  reviewId?: string;
  txHash?: string;
}

export const submitReviewToDatabase = async (
  formData: ReviewFormData,
  walletAddress: string,
  txHash?: string
): Promise<SubmissionResult> => {
  try {
    console.log('💾 Submitting review to database:', {
      company: formData.companyName,
      category: formData.category,
      title: formData.title,
      wallet: walletAddress,
      txHash
    });

    // Sanitize all input data
    const sanitizedData = {
      company_name: sanitizeInput(formData.companyName),
      category: sanitizeInput(formData.category),
      title: sanitizeInput(formData.title),
      content: sanitizeInput(formData.review),
      rating: Math.max(1, Math.min(5, formData.rating)),
      wallet_address: walletAddress,
      // If there's a successful transaction hash, automatically approve the review
      status: txHash ? 'approved' as const : 'pending' as const
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error('❌ Database submission error:', error);
      return {
        success: false,
        message: 'Failed to save review to database. Please try again.',
      };
    }

    console.log('✅ Review saved to database:', data);

    return {
      success: true,
      message: txHash 
        ? 'Review submitted successfully and approved! You have earned 10 $TRUST tokens.'
        : 'Review submitted successfully and is pending approval.',
      reviewId: data.id,
      txHash
    };

  } catch (error) {
    console.error('❌ Unexpected error in submitReviewToDatabase:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
};
