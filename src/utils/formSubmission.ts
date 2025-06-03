
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput, sanitizeWalletAddress, validateFileType, validateFileSize } from "./inputSanitization";

export interface ReviewFormData {
  companyName: string;
  category: string;
  rating: number;
  title: string;
  review: string;
  pros: string;
  cons: string;
}

export const submitReview = async (
  formData: ReviewFormData,
  files: File[],
  walletAddress: string,
  userId: string
): Promise<void> => {
  console.log('Starting review submission process');
  
  // Sanitize all inputs
  const sanitizedData = {
    companyName: sanitizeInput(formData.companyName),
    category: sanitizeInput(formData.category),
    rating: Math.max(1, Math.min(5, Math.floor(formData.rating))), // Ensure rating is 1-5
    title: sanitizeInput(formData.title),
    review: sanitizeInput(formData.review)
  };
  
  const sanitizedWalletAddress = sanitizeWalletAddress(walletAddress);
  
  // Validate sanitized data
  if (!sanitizedData.companyName || !sanitizedData.category || !sanitizedData.title || !sanitizedData.review) {
    throw new Error('All fields are required and must contain valid data');
  }
  
  if (!sanitizedWalletAddress) {
    throw new Error('Invalid wallet address format');
  }
  
  if (files.length === 0) {
    throw new Error('At least one proof file is required');
  }
  
  // Validate all files
  for (const file of files) {
    if (!validateFileType(file)) {
      throw new Error(`Invalid file type: ${file.name}. Only PDF, PNG, JPEG, and JPG files are allowed.`);
    }
    
    if (!validateFileSize(file, 5)) {
      throw new Error(`File too large: ${file.name}. Maximum size is 5MB per file.`);
    }
  }
  
  try {
    // Upload files to secure storage
    const uploadedFiles: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${i}.${fileExtension}`;
      
      console.log('Uploading file:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('review-proofs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw new Error(`Failed to upload file: ${file.name}`);
      }
      
      uploadedFiles.push(uploadData.path);
    }
    
    console.log('Files uploaded successfully:', uploadedFiles);
    
    // Insert review into database
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        wallet_address: sanitizedWalletAddress,
        company_name: sanitizedData.companyName,
        category: sanitizedData.category,
        rating: sanitizedData.rating,
        title: sanitizedData.title,
        content: sanitizedData.review,
        proof_file_url: uploadedFiles[0], // Primary file
        proof_file_name: files[0].name,
        status: 'pending'
      })
      .select()
      .single();
    
    if (reviewError) {
      console.error('Database insert error:', reviewError);
      
      // Clean up uploaded files if database insert fails
      for (const filePath of uploadedFiles) {
        await supabase.storage.from('review-proofs').remove([filePath]);
      }
      
      throw new Error('Failed to save review to database');
    }
    
    console.log('Review submitted successfully:', reviewData);
    
  } catch (error) {
    console.error('Review submission failed:', error);
    throw error;
  }
};
