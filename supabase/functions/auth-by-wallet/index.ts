
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

    // For existing users, use magiclink type which creates immediate session
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!
    })

    if (linkError || !linkData) {
      console.error('Magic link generation error:', linkError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate auth session' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Magic link generated successfully')
    console.log('Link data properties:', linkData.properties)

    // The magic link contains the tokens directly in the properties
    const accessToken = linkData.properties?.access_token
    const refreshToken = linkData.properties?.refresh_token

    console.log('Access token found:', !!accessToken)
    console.log('Refresh token found:', !!refreshToken)

    if (!accessToken) {
      // Try parsing from the action link as fallback
      const url = new URL(linkData.properties.action_link)
      const urlAccessToken = url.searchParams.get('access_token')
      const urlRefreshToken = url.searchParams.get('refresh_token')

      console.log('Fallback - URL access token found:', !!urlAccessToken)

      if (urlAccessToken) {
        return new Response(
          JSON.stringify({ 
            success: true,
            access_token: urlAccessToken,
            refresh_token: urlRefreshToken || '',
            user: user
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.error('No access token found in magic link')
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
