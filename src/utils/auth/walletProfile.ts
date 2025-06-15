
import { supabase } from "@/integrations/supabase/client";

// Check if wallet address exists in profiles table
export const checkWalletExists = async (walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('wallet_address', walletAddress)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking wallet:', error);
      return { exists: false, userId: null };
    }
    
    return { exists: !!data, userId: data?.id || null };
  } catch (error) {
    console.error('Error checking wallet exists:', error);
    return { exists: false, userId: null };
  }
};

// Update user profile with wallet address after signup
export const linkWalletToProfile = async (userId: string, walletAddress: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error linking wallet to profile:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error linking wallet to profile:', error);
    return { success: false, error };
  }
};
