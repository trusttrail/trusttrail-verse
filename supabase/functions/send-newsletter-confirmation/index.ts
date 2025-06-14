
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #faf8ff; border-radius: 10px; padding: 32px 28px; box-shadow: 0 2px 10px 0 #eee;">
        <h2 style="color: #7b58f6;">Thanks for Subscribing to TrustTrail!</h2>
        <p>Thanks for subscribing to the TrustTrail journey, stay tuned on the latest updates on feature releases, token news, and community events.</p>
        <hr style="border-top: 1px solid #ededed; margin: 32px 0 18px 0;" />
        <p style="font-size: 13px; color: #888;">You are receiving this email for newsletter confirmation at <strong>TrustTrail</strong>.<br>
        If you did not subscribe, please ignore this email.</p>
        <p style="font-size: 11px; margin-top: 18px;">&copy; ${new Date().getFullYear()} TrustTrail</p>
      </div>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "TrustTrail <hellotrusttrail@gmail.com>",
      to: [email],
      subject: "Welcome to TrustTrail Newsletter!",
      html: htmlContent,
    });

    console.log("Newsletter confirmation sent:", email);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending newsletter confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
