
import { supabase } from "@/integrations/supabase/client";

export const authenticateByWallet = async (walletAddress: string) => {
  try {
    console.log('🔐 Starting wallet-based authentication for:', walletAddress);
    
    // Call our edge function to get auth tokens
    const { data, error } = await supabase.functions.invoke('auth-by-wallet', {
      body: { walletAddress }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      return { success: false, error: error.message };
    }

    if (!data.success || !data.access_token) {
      console.error('❌ No access token received:', data);
      return { success: false, error: data.error || 'No access token received' };
    }

    console.log('✅ Received auth tokens, setting session...');

    // For JWT tokens, we need to set the session differently
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token || ''
    });

    if (sessionError) {
      console.error('❌ Session setup error:', sessionError);
      return { success: false, error: sessionError.message };
    }

    console.log('✅ Wallet authentication successful!');
    return { 
      success: true, 
      user: sessionData.user,
      session: sessionData.session 
    };

  } catch (error) {
    console.error('❌ Wallet authentication error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
};
