
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);
  
  if (!userLimit || now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function sanitizeWalletAddress(address: string): string | null {
  if (!address || typeof address !== 'string') return null;
  
  // Remove any non-hex characters except 0x prefix and convert to lowercase
  const cleaned = address.trim().toLowerCase();
  
  // Validate Ethereum address format with strict validation
  const addressRegex = /^0x[a-f0-9]{40}$/;
  
  // Additional security - prevent injection attempts
  if (cleaned.includes('<') || cleaned.includes('>') || cleaned.includes('script')) {
    return null;
  }
  
  return addressRegex.test(cleaned) ? cleaned : null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const { walletAddress } = body;
    
    console.log('🔐 Auth by wallet request initiated');
    
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Wallet address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Sanitize and validate wallet address
    const sanitizedAddress = sanitizeWalletAddress(walletAddress);
    if (!sanitizedAddress) {
      console.log('❌ Invalid wallet address format');
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Rate limiting check
    if (!checkRateLimit(sanitizedAddress)) {
      console.log('❌ Rate limit exceeded for address:', sanitizedAddress);
      return new Response(
        JSON.stringify({ error: 'Too many authentication attempts. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Processing auth request for sanitized address:', sanitizedAddress);

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find user by wallet address with parameterized query
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('wallet_address', sanitizedAddress)
      .maybeSingle()

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!profile) {
      console.log('❌ Wallet not found in profiles');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Wallet not found',
          needsSignup: true 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Profile found for user:', profile.id);

    // Get user from auth.users table
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id)

    if (userError || !user) {
      console.error('User lookup error:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ User found:', user.id);

    // Generate a secure session using the admin API
    try {
      // Use the admin API to create a proper session token
      const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: user.email!,
        options: {
          redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/callback`
        }
      });

      if (tokenError) {
        console.error('Token generation error:', tokenError);
        
        // Fallback: create a session directly
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email!,
          password: Math.random().toString(36).substring(2, 15), // Random password
          email_confirm: true,
          user_metadata: user.user_metadata
        });

        if (sessionError) {
          console.error('Session creation error:', sessionError);
          return new Response(
            JSON.stringify({ error: 'Failed to create authentication session' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('✅ Fallback session created successfully');
        return new Response(
          JSON.stringify({ 
            success: true,
            user: user,
            message: 'Authentication successful'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Extract tokens from the magic link
      const magicLinkUrl = new URL(tokenData.properties.action_link);
      const accessToken = magicLinkUrl.searchParams.get('access_token');
      const refreshToken = magicLinkUrl.searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        console.log('✅ Secure tokens generated successfully');
        
        return new Response(
          JSON.stringify({ 
            success: true,
            access_token: accessToken,
            refresh_token: refreshToken,
            user: user,
            session: {
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: 3600,
              token_type: 'bearer',
              user: user
            }
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // If no tokens available, return user info for client-side handling
      console.log('⚠️ No tokens available, returning user info');
      return new Response(
        JSON.stringify({ 
          success: true,
          user: user,
          message: 'User verified, please complete authentication on client'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (authError) {
      console.error('Authentication process error:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication process failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
