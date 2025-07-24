
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
    // Get current user for secure review submission
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Authentication required for review submission');
      return {
        success: false,
        message: 'Please sign in to submit a review.',
      };
    }

    console.log('💾 Submitting review to database with INSTANT AI screening:', {
      company: formData.companyName,
      category: formData.category,
      title: formData.title,
      wallet: walletAddress,
      userId: user.id,
      txHash
    });

    // Run INSTANT AI screening - no more than 1 second
    console.log('🚀 Running INSTANT AI screening...');
    const aiStartTime = Date.now();
    
    const aiResult = await screenReviewWithAI({
      companyName: formData.companyName,
      category: formData.category,
      title: formData.title,
      content: formData.review,
      rating: formData.rating
    });

    const aiProcessingTime = Date.now() - aiStartTime;
    console.log('🤖 AI screening completed in', aiProcessingTime, 'ms:', aiResult);

    // Sanitize all input data
    const sanitizedData = {
      user_id: user.id, // Required for security compliance
      company_name: sanitizeInput(formData.companyName),
      category: sanitizeInput(formData.category),
      title: sanitizeInput(formData.title),
      content: sanitizeInput(formData.review),
      rating: Math.max(1, Math.min(5, formData.rating)),
      wallet_address: walletAddress.toLowerCase(),
      // IMMEDIATE DECISION: No pending status ever - approved or rejected instantly
      status: aiResult.approved ? 'approved' as const : 'rejected' as const
    };

    console.log('📝 Prepared data for database:', sanitizedData);
    console.log('⚡ Review INSTANTLY decided as:', sanitizedData.status === 'approved' ? '✅ APPROVED' : '❌ REJECTED');

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

      const statusMessage = sanitizedData.status === 'approved' 
        ? '🎉 Review INSTANTLY APPROVED! ✅ It\'s now live in Recent Reviews and your Dashboard.'
        : '❌ Review was rejected by AI screening. Please review the content and try again.';

      console.log('✅ Review saved on retry:', retryData);
      return {
        success: true,
        message: txHash 
          ? `${statusMessage} You have earned 10 $TRUST tokens.`
          : statusMessage,
        reviewId: retryData?.[0]?.id,
        txHash,
        aiScreeningResult: aiResult
      };
    }

    console.log('✅ Review saved to database:', data);

    const statusMessage = sanitizedData.status === 'approved' 
      ? '🎉 Review INSTANTLY APPROVED! ✅ It\'s now live in Recent Reviews and your Dashboard.'
      : '❌ Review was rejected by AI screening. Please review the content and try again.';

    return {
      success: true,
      message: txHash 
        ? `${statusMessage} You have earned 10 $TRUST tokens.`
        : statusMessage,
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
