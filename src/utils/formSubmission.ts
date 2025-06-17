
import { ReviewFormData } from '@/hooks/useReviewForm';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from './inputSanitization';
import { screenReviewWithAI } from './aiReviewScreening';

export interface SubmissionResult {
  success: boolean;
  message: string;
  reviewId?: string;
  txHash?: string;
  aiScreeningResult?: any;
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

    // Run AI screening first
    console.log('🤖 Running AI screening...');
    const aiResult = await screenReviewWithAI({
      companyName: formData.companyName,
      category: formData.category,
      title: formData.title,
      content: formData.review,
      rating: formData.rating
    });

    console.log('🤖 AI screening completed:', aiResult);

    // Sanitize all input data
    const sanitizedData = {
      company_name: sanitizeInput(formData.companyName),
      category: sanitizeInput(formData.category),
      title: sanitizeInput(formData.title),
      content: sanitizeInput(formData.review),
      rating: Math.max(1, Math.min(5, formData.rating)),
      wallet_address: walletAddress.toLowerCase(),
      // Auto-approve if AI screening passed OR if there's a successful blockchain transaction
      status: (aiResult.approved || txHash) ? 'approved' as const : 'pending' as const
    };

    console.log('📝 Prepared data for database:', sanitizedData);
    console.log('✅ Review will be:', sanitizedData.status === 'approved' ? 'APPROVED' : 'PENDING');

    const { data, error } = await supabase
      .from('reviews')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error('❌ Database submission error:', error);
      
      // Try alternative insertion method if the first one fails
      console.log('🔄 Retrying with alternative method...');
      const { data: retryData, error: retryError } = await supabase
        .from('reviews')
        .insert([sanitizedData])
        .select();

      if (retryError) {
        console.error('❌ Retry also failed:', retryError);
        return {
          success: false,
          message: 'Failed to save review to database. Please contact support.',
        };
      }

      const approvedMessage = sanitizedData.status === 'approved' 
        ? 'Review submitted and automatically approved! ✅ It will appear in Recent Reviews and your Dashboard.'
        : 'Review submitted and is pending further review.';

      console.log('✅ Review saved on retry:', retryData);
      return {
        success: true,
        message: txHash 
          ? `${approvedMessage} You have earned 10 $TRUST tokens.`
          : approvedMessage,
        reviewId: retryData?.[0]?.id,
        txHash,
        aiScreeningResult: aiResult
      };
    }

    console.log('✅ Review saved to database:', data);

    const approvedMessage = sanitizedData.status === 'approved' 
      ? 'Review submitted and automatically approved! ✅ It will appear in Recent Reviews and your Dashboard.'
      : 'Review submitted and is pending further review.';

    return {
      success: true,
      message: txHash 
        ? `${approvedMessage} You have earned 10 $TRUST tokens.`
        : approvedMessage,
      reviewId: data.id,
      txHash,
      aiScreeningResult: aiResult
    };

  } catch (error) {
    console.error('❌ Unexpected error in submitReviewToDatabase:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
};
