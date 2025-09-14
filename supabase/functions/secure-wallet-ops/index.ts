import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, content-type',
}

interface WalletProfile {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { operation, walletAddress } = await req.json()

    // Validate input
    if (!walletAddress || typeof walletAddress !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid wallet address' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const normalizedAddress = walletAddress.toLowerCase().trim()
    
    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid wallet address format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Log the operation for security monitoring
    await supabaseClient
      .from('audit_logs')
      .insert({
        action: `secure_wallet_${operation}`,
        table_name: 'wallet_profiles',
        details: { 
          wallet_address: normalizedAddress,
          operation,
          timestamp: Date.now()
        }
      })

    if (operation === 'create_wallet_profile') {
      // Create wallet profile securely
      const { data, error } = await supabaseClient
        .from('wallet_profiles')
        .insert({ wallet_address: normalizedAddress })
        .select('id, wallet_address, created_at, updated_at')
        .single()

      if (error) {
        console.error('Error creating wallet profile:', error)
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid operation' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )

  } catch (error) {
    console.error('Error in secure-wallet-ops:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})