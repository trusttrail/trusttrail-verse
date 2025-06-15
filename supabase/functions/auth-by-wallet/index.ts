
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { walletAddress } = await req.json()
    
    console.log('🔐 Auth by wallet request for:', walletAddress)
    
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Wallet address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find user by wallet address
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('wallet_address', walletAddress.toLowerCase())
      .maybeSingle()

    if (profileError) {
      console.error('Profile lookup error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!profile) {
      console.log('❌ Wallet not found in profiles')
      return new Response(
        JSON.stringify({ error: 'Wallet not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Profile found for user:', profile.id)

    // Get user from auth.users table
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id)

    if (userError || !user) {
      console.error('User lookup error:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ User found:', user.id)

    // Generate access token using the correct method - createSignedJWT
    const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.admin.createSignedJWT({
      sub: profile.id,
      aud: 'authenticated',
      role: 'authenticated'
    })

    if (tokenError || !tokenData) {
      console.error('Token generation error:', tokenError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate access token' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Access token generated successfully')

    // For JWT tokens, we need to return the token directly
    return new Response(
      JSON.stringify({ 
        success: true,
        access_token: tokenData,
        refresh_token: '', // JWT tokens don't have refresh tokens
        user: user
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
