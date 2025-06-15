
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

    // Create a session directly using admin API - this bypasses email verification
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: user.email!,
      options: {
        data: {
          wallet_address: walletAddress,
          skip_confirmation: true
        }
      }
    })

    if (sessionError || !sessionData) {
      console.error('Session creation error:', sessionError)
      
      // Fallback: try to create access token directly
      try {
        console.log('🔄 Trying alternative token generation method...')
        
        // Use the admin API to create a session for the user
        const { data: tokenResponse, error: tokenError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email!,
          email_confirm: true,
          user_metadata: {
            wallet_address: walletAddress
          }  
        })
        
        if (tokenError) {
          throw tokenError
        }

        // Since we can't directly create tokens, we'll use a different approach
        // Generate a temporary signin link that auto-confirms
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'invite',
          email: user.email!,
          options: {
            data: {
              wallet_address: walletAddress
            }
          }
        })

        if (signInError || !signInData) {
          throw new Error('Failed to generate signin link')
        }

        // Extract tokens from the generated link
        const url = new URL(signInData.properties.action_link)
        const accessToken = url.searchParams.get('access_token')
        const refreshToken = url.searchParams.get('refresh_token')

        if (accessToken) {
          console.log('✅ Successfully generated tokens via fallback method')
          
          return new Response(
            JSON.stringify({ 
              success: true,
              access_token: accessToken,
              refresh_token: refreshToken || '',
              user: user
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
      } catch (fallbackError) {
        console.error('Fallback token generation failed:', fallbackError)
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Session created successfully')

    // Extract tokens from the response
    const url = new URL(sessionData.properties.action_link)
    const accessToken = url.searchParams.get('access_token')
    const refreshToken = url.searchParams.get('refresh_token')

    if (!accessToken) {
      console.error('No access token in generated session')
      return new Response(
        JSON.stringify({ error: 'Failed to extract access token' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        access_token: accessToken,
        refresh_token: refreshToken || '',
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
