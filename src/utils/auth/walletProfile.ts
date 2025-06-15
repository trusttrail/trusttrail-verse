
import { supabase } from "@/integrations/supabase/client";

// Check if wallet address exists in profiles table
export const checkWalletExists = async (walletAddress: string) => {
  console.log('=== CHECK WALLET EXISTS DEBUG START ===');
  console.log('Input wallet address:', walletAddress);
  console.log('Normalized address:', walletAddress?.toLowerCase());
  
  try {
    // Normalize the address to lowercase for consistent comparison
    const normalizedAddress = walletAddress.toLowerCase();
    
    console.log('Executing Supabase query with case-insensitive search...');
    
    // Use eq with normalized address instead of ilike to avoid query issues
    const { data, error } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('wallet_address', normalizedAddress)
      .maybeSingle();
    
    console.log('Supabase query result:');
    console.log('- Data:', data);
    console.log('- Error:', error);
    
    if (error) {
      console.error('❌ Error checking wallet:', error);
      return { exists: false, userId: null };
    }
    
    const exists = !!data;
    const userId = data?.id || null;
    
    console.log('Final result:');
    console.log('- Exists:', exists);
    console.log('- User ID:', userId);
    console.log('=== CHECK WALLET EXISTS DEBUG END ===');
    
    return { exists, userId };
  } catch (error) {
    console.error('❌ Exception in checkWalletExists:', error);
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
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        wallet_address: normalizedAddress,
        updated_at: new Date().toISOString()
      });
    
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
