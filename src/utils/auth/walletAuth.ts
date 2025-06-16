
import { supabase } from "@/integrations/supabase/client";
import { sanitizeWalletAddress } from "@/utils/inputSanitization";

// Rate limiting for client-side authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_AUTH_ATTEMPTS = 3;
const AUTH_COOLDOWN = 30000; // 30 seconds

function checkAuthRateLimit(address: string): boolean {
  const now = Date.now();
  const attempts = authAttempts.get(address);
  
  if (!attempts || now - attempts.lastAttempt > AUTH_COOLDOWN) {
    authAttempts.set(address, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (attempts.count >= MAX_AUTH_ATTEMPTS) {
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  return true;
}

export const authenticateByWallet = async (walletAddress: string) => {
  try {
    console.log('🔐 Starting secure wallet-based authentication');
    
    // Sanitize wallet address first
    const sanitizedAddress = sanitizeWalletAddress(walletAddress);
    if (!sanitizedAddress) {
      console.error('❌ Invalid wallet address format');
      return { success: false, error: 'Invalid wallet address format' };
    }

    // Check rate limiting
    if (!checkAuthRateLimit(sanitizedAddress)) {
      console.error('❌ Authentication rate limit exceeded');
      return { 
        success: false, 
        error: 'Too many authentication attempts. Please wait before trying again.' 
      };
    }
    
    // Call our secure edge function
    const { data, error } = await supabase.functions.invoke('auth-by-wallet', {
      body: { walletAddress: sanitizedAddress }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      return { success: false, error: error.message };
    }

    if (!data || !data.success) {
      console.error('❌ Authentication failed:', data?.error);
      return { 
        success: false, 
        error: data?.error || 'Authentication failed',
        needsSignup: data?.needsSignup 
      };
    }

    console.log('✅ Received secure auth response');

    // Handle token-based authentication
    if (data.access_token && data.refresh_token) {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        });

        if (sessionError) {
          console.error('❌ Session setup error:', sessionError);
          return { success: false, error: sessionError.message };
        }

        console.log('✅ Secure wallet authentication successful with tokens!');
        
        // Clear rate limiting on success
        authAttempts.delete(sanitizedAddress);
        
        return { 
          success: true, 
          user: sessionData.user,
          session: sessionData.session 
        };
      } catch (sessionError) {
        console.error('❌ Session creation error:', sessionError);
        return { success: false, error: 'Failed to create secure session' };
      }
    }

    // Handle user verification response (client needs to complete auth)
    if (data.user) {
      console.log('✅ User verified, authentication ready');
      return { 
        success: true, 
        user: data.user,
        message: data.message,
        requiresClientAuth: true
      };
    }

    console.error('❌ Unexpected response format from auth service');
    return { success: false, error: 'Unexpected authentication response' };

  } catch (error) {
    console.error('❌ Wallet authentication error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
};
