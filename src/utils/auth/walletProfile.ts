
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
    
    // Use eq with normalized lowercase address for exact matching
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
      
      // Let's also try a direct count query to see if there are any records at all
      console.log('Running additional diagnostic query...');
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('wallet_address', 'is', null);
      
      console.log('Total profiles with wallet addresses:', count);
      if (countError) {
        console.error('Count query error:', countError);
      }
      
      // Also try a like query to see if there are similar addresses
      const { data: similarData, error: similarError } = await supabase
        .from('profiles')
        .select('id, wallet_address')
        .ilike('wallet_address', `%${normalizedAddress.slice(-10)}`);
      
      console.log('Similar wallet addresses found:', similarData);
      if (similarError) {
        console.error('Similar query error:', similarError);
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
