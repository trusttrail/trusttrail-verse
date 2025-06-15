import { supabase } from "@/integrations/supabase/client";

// Check if wallet address exists in profiles table
export const checkWalletExists = async (walletAddress: string) => {
  console.log('=== CHECK WALLET EXISTS DEBUG START ===');
  console.log('Input wallet address:', walletAddress);
  console.log('Normalized address:', walletAddress?.toLowerCase());
  
  try {
    // Normalize the address to lowercase for consistent comparison
    const normalizedAddress = walletAddress.toLowerCase();
    
    console.log('Executing Supabase query with normalized address...');
    console.log('Query details:', {
      table: 'profiles',
      column: 'wallet_address',
      searchValue: normalizedAddress,
      method: 'eq (exact match on normalized)'
    });
    
    // First, let's try a simple select to see all profiles with wallet addresses
    const { data: allProfiles, error: debugError } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .not('wallet_address', 'is', null);
    
    console.log('DEBUG: All profiles with wallet addresses:', allProfiles);
    console.log('DEBUG: Error in fetching all profiles:', debugError);
    
    // Now try the specific query
    const { data, error } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('wallet_address', normalizedAddress)
      .maybeSingle();
    
    console.log('Supabase query completed');
    console.log('Raw Supabase response:');
    console.log('- Data:', JSON.stringify(data, null, 2));
    console.log('- Error:', JSON.stringify(error, null, 2));
    
    if (error) {
      console.error('❌ Supabase error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { exists: false, userId: null };
    }
    
    const exists = !!data;
    const userId = data?.id || null;
    
    console.log('Processing results:');
    console.log('- Data exists:', exists);
    console.log('- User ID:', userId);
    console.log('- Found wallet address:', data?.wallet_address);
    
    if (exists) {
      console.log('✅ WALLET FOUND IN DATABASE');
    } else {
      console.log('❌ WALLET NOT FOUND IN DATABASE');
      
      // Check if the address exists with different casing
      const { data: caseInsensitiveData, error: caseError } = await supabase
        .from('profiles')
        .select('id, wallet_address')
        .ilike('wallet_address', normalizedAddress);
        
      console.log('Case-insensitive search result:', caseInsensitiveData);
      if (caseError) {
        console.error('Case-insensitive query error:', caseError);
      }
    }
    
    console.log('Final result:');
    console.log('- Exists:', exists);
    console.log('- User ID:', userId);
    console.log('=== CHECK WALLET EXISTS DEBUG END ===');
    
    return { exists, userId };
  } catch (error) {
    console.error('❌ Exception in checkWalletExists:', error);
    console.error('Exception details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    console.log('=== CHECK WALLET EXISTS DEBUG END ===');
    return { exists: false, userId: null };
  }
};

// Update user profile with wallet address after signup
export const linkWalletToProfile = async (userId: string, walletAddress: string) => {
  console.log('=== LINK WALLET TO PROFILE DEBUG ===');
  console.log('User ID:', userId);
  console.log('Wallet Address:', walletAddress);
  
  try {
    // Normalize the address to lowercase
    const normalizedAddress = walletAddress.toLowerCase();
    console.log('Normalized address for linking:', normalizedAddress);
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        wallet_address: normalizedAddress,
        updated_at: new Date().toISOString()
      })
      .select();
    
    console.log('Link wallet result:', { data, error });
    
    if (error) {
      console.error('❌ Error linking wallet to profile:', error);
      return { success: false, error };
    }
    
    console.log('✅ Wallet linked successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Exception linking wallet to profile:', error);
    return { success: false, error };
  }
};
