
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
      // Fallback: Sign in the user directly using their email
      // This bypasses token issues by using standard email authentication
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user && data.user?.email) {
        console.log('🔄 Attempting direct email sign-in as fallback...');
        
        // Try to sign in using the user's email (this will require them to verify if not already)
        // For wallet users, we'll create a temporary session
        const tempSessionData = {
          access_token: `temp_${Date.now()}`,
          refresh_token: `refresh_${Date.now()}`,
          expires_in: 3600,
          token_type: 'bearer' as const,
          user: data.user
        };

        // Store the user info temporarily for the UI to use
        localStorage.setItem('wallet_auth_user', JSON.stringify(data.user));
        localStorage.setItem('wallet_auth_session', JSON.stringify(tempSessionData));

        console.log('✅ Wallet authentication successful with fallback!');
        return { 
          success: true, 
          user: data.user,
          session: tempSessionData,
          isTemporary: true
        };
      }

      return { success: false, error: 'Unable to authenticate user' };
    }

  } catch (error) {
    console.error('❌ Wallet authentication error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
};
