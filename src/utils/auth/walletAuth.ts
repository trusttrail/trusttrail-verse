
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

    if (!data.success) {
      console.error('❌ Authentication failed:', data.error);
      return { success: false, error: data.error || 'Authentication failed' };
    }

    console.log('✅ Received auth response, setting session...');

    // Handle both token-based and direct session responses
    if (data.access_token && data.access_token !== 'wallet_auth_session') {
      // Use real tokens from the edge function
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token || ''
      });

      if (sessionError) {
        console.error('❌ Session setup error:', sessionError);
        return { success: false, error: sessionError.message };
      }

      console.log('✅ Wallet authentication successful with tokens!');
      return { 
        success: true, 
        user: sessionData.user,
        session: sessionData.session 
      };
    } else {
      // For fallback session responses, let Supabase handle the auth state naturally
      console.log('✅ Wallet authentication successful with session data!');
      
      // Store minimal auth info if needed but let Supabase manage the session
      if (data.user) {
        console.log('📝 User data received:', data.user.email);
      }

      return { 
        success: true, 
        user: data.user,
        session: data.session,
        isTemporary: true
      };
    }

  } catch (error) {
    console.error('❌ Wallet authentication error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
};
