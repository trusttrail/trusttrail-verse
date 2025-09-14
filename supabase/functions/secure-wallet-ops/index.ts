import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { operation, walletAddress } = await req.json();

    if (!operation) {
      return new Response(
        JSON.stringify({ error: 'Operation is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    switch (operation) {
      case 'create_wallet_profile': {
        if (!walletAddress) {
          return new Response(
            JSON.stringify({ error: 'Wallet address is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Validate wallet address format
        const normalizedAddress = walletAddress.toLowerCase().trim();
        if (!/^0x[a-f0-9]{40}$/.test(normalizedAddress)) {
          return new Response(
            JSON.stringify({ error: 'Invalid wallet address format' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Create wallet profile using admin client
        const { data, error } = await supabaseClient
          .from('wallet_profiles')
          .insert({ wallet_address: normalizedAddress })
          .select('id, wallet_address, created_at, updated_at')
          .single();

        if (error) {
          console.error('Error creating wallet profile:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to create wallet profile' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown operation' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }
  } catch (error) {
    console.error('Secure wallet ops error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});